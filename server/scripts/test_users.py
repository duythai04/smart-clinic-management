import json
import sys
import uuid
import secrets

from getpass import getpass
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


BASE_URL = "http://127.0.0.1:8080/api/v1"

ADMIN_EMAIL = "admin@mediclinic.local"

ORIGIN = "http://127.0.0.1:5173"

passed = 0
failed = 0


def request(method, path, data=None, token=None):

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": ORIGIN,
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = None

    if data is not None:
        body = json.dumps(data).encode("utf-8")

    req = Request(
        BASE_URL + path,
        data=body,
        headers=headers,
        method=method,
    )

    try:

        with urlopen(req, timeout=15) as response:

            raw = response.read().decode("utf-8")

            return (
                response.status,
                json.loads(raw) if raw else None,
            )

    except HTTPError as error:

        raw = error.read().decode("utf-8")

        try:
            data = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            data = raw

        return error.code, data

    except URLError as error:

        raise RuntimeError(
            f"Không thể kết nối Backend: {error}"
        ) from error


def check(name, expected, actual):

    global passed, failed

    success = expected == actual

    if success:
        passed += 1
        status = "PASS"
    else:
        failed += 1
        status = "FAIL"

    print(
        f"[{status}] {name} | "
        f"Expected: {expected} | Actual: {actual}"
    )

    return success


def main():

    admin_password = getpass("Admin password: ")

    print("\nMEDICLINIC USER MANAGEMENT TEST")
    print("=" * 65)

    # ======================================
    # HEALTH CHECK
    # ======================================

    status, _ = request("GET", "/health")

    check("Health Check", 200, status)

    # ======================================
    # UNAUTHENTICATED REQUEST
    # ======================================

    status, _ = request("GET", "/users")

    check("Users without token", 401, status)

    status, _ = request("GET", "/roles")

    check("Roles without token", 401, status)

    # ======================================
    # ADMIN LOGIN
    # ======================================

    status, data = request(
        "POST",
        "/auth/login",
        {
            "email": ADMIN_EMAIL,
            "password": admin_password,
        },
    )

    if not check("Admin Login", 200, status):

        print(data)

        return

    token = data["accessToken"]

    # ======================================
    # GET USERS
    # ======================================

    status, data = request(
        "GET",
        "/users?page=0&size=10",
        token=token,
    )

    check("Get Users", 200, status)

    if status == 200:

        check(
            "Pagination exists",
            True,
            "content" in data
            and "totalElements" in data
            and "totalPages" in data,
        )

        print(
            "Total users:",
            data.get("totalElements")
        )

    # ======================================
    # GET ROLES
    # ======================================

    status, data = request(
        "GET",
        "/roles",
        token=token,
    )

    check("Get Roles", 200, status)

    if status == 200:

        check(
            "Six roles exist",
            6,
            len(data),
        )

    # ======================================
    # CREATE DOCTOR ACCOUNT
    # ======================================

    suffix = uuid.uuid4().hex[:10]

    doctor_email = (
        f"doctor.test.{suffix}@mediclinic.local"
    )

    doctor_password = secrets.token_urlsafe(24)

    doctor_request = {
        "fullName": "Bác sĩ kiểm thử",
        "email": doctor_email,
        "phone": "0901234567",
        "password": doctor_password,
        "roles": ["DOCTOR"],
    }

    status, data = request(
        "POST",
        "/users",
        doctor_request,
        token=token,
    )

    if not check("Create Doctor", 201, status):

        print(data)

        return

    doctor_id = data["id"]

    check(
        "Doctor role assigned",
        True,
        "DOCTOR" in data["roles"],
    )

    check(
        "Doctor account active",
        True,
        data["active"],
    )

    check(
        "Password not exposed",
        False,
        "password" in data
        or "passwordHash" in data
        or "password_hash" in data,
    )

    # ======================================
    # GET USER DETAIL
    # ======================================

    status, data = request(
        "GET",
        f"/users/{doctor_id}",
        token=token,
    )

    check("Get Doctor Detail", 200, status)

    if status == 200:

        check(
            "Correct Doctor Email",
            doctor_email,
            data["email"],
        )

    # ======================================
    # SEARCH USERS
    # ======================================

    status, data = request(
        "GET",
        f"/users?keyword={suffix}",
        token=token,
    )

    check("Search Users", 200, status)

    if status == 200:

        check(
            "Search finds Doctor",
            True,
            any(
                user["id"] == doctor_id
                for user in data["content"]
            ),
        )

    # ======================================
    # FILTER BY ROLE
    # ======================================

    status, data = request(
        "GET",
        "/users?role=DOCTOR&size=100",
        token=token,
    )

    check("Filter Doctor Role", 200, status)

    if status == 200:

        check(
            "Correct role filtering",
            True,
            len(data["content"]) > 0
            and all(
                "DOCTOR" in user["roles"]
                for user in data["content"]
            ),
        )

    # ======================================
    # FILTER BY STATUS
    # ======================================

    status, data = request(
        "GET",
        "/users?active=true",
        token=token,
    )

    check("Filter Active Users", 200, status)

    if status == 200:

        check(
            "Correct active filtering",
            True,
            all(
                user["active"]
                for user in data["content"]
            ),
        )

    # ======================================
    # DUPLICATE EMAIL
    # ======================================

    status, _ = request(
        "POST",
        "/users",
        doctor_request,
        token=token,
    )

    check("Duplicate Email", 409, status)

    # ======================================
    # INVALID USER DATA
    # ======================================

    status, _ = request(
        "POST",
        "/users",
        {
            "fullName": "",
            "email": "invalid-email",
            "password": "123",
            "roles": [],
        },
        token=token,
    )

    check("Invalid User Data", 400, status)

    # ======================================
    # INVALID PAGINATION
    # ======================================

    status, _ = request(
        "GET",
        "/users?page=-1&size=10",
        token=token,
    )

    check("Invalid Pagination", 400, status)

    # ======================================
    # DOCTOR LOGIN
    # ======================================

    status, data = request(
        "POST",
        "/auth/login",
        {
            "email": doctor_email,
            "password": doctor_password,
        },
    )

    if not check("Doctor Login", 200, status):

        print(data)

        return

    doctor_token = data["accessToken"]

    # ======================================
    # RBAC TEST
    # ======================================

    status, _ = request(
        "GET",
        "/users",
        token=doctor_token,
    )

    check("Doctor cannot list users", 403, status)

    status, _ = request(
        "GET",
        f"/users/{doctor_id}",
        token=doctor_token,
    )

    check("Doctor cannot access user detail", 403, status)

    status, _ = request(
        "GET",
        "/roles",
        token=doctor_token,
    )

    check("Doctor cannot list roles", 403, status)

    status, _ = request(
        "POST",
        "/users",
        doctor_request,
        token=doctor_token,
    )

    check("Doctor cannot create users", 403, status)

    # ======================================
    # PATIENT RBAC
    # ======================================

    status, _ = request(
        "GET",
        "/patients",
        token=doctor_token,
    )

    check("Doctor can view patients", 200, status)

    status, _ = request(
        "POST",
        "/patients",
        {
            "fullName": "Bệnh nhân kiểm thử",
            "gender": "MALE",
            "dateOfBirth": "2000-01-01",
            "phone": "0900000000",
        },
        token=doctor_token,
    )

    check("Doctor cannot create patient", 403, status)

    # ======================================
    # TEST ACCOUNT INFORMATION
    # ======================================

    print("\nCreated test account:")
    print("ID:", doctor_id)
    print("Email:", doctor_email)
    print("Role: DOCTOR")

    print(
        "\nTài khoản kiểm thử được giữ lại trong database."
    )


if __name__ == "__main__":

    try:

        main()

    except Exception as error:

        failed += 1

        print("\n[ERROR]", error)

    finally:

        print("\n" + "=" * 65)

        print("USER MANAGEMENT TEST SUMMARY")

        print("=" * 65)

        print("Passed :", passed)

        print("Failed :", failed)

        print("Total  :", passed + failed)

        if failed == 0 and passed == 30:

            print("\nALL TESTS PASSED")

        else:

            print("\nTESTS FAILED OR INCOMPLETE")

    sys.exit(
        0 if failed == 0 and passed == 30 else 1
    )