import json
import uuid
import secrets
import getpass
import sys

from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from http.cookies import SimpleCookie

BASE_URL = "http://127.0.0.1:8080/api/v1"
ORIGIN = "http://127.0.0.1:5173"
ADMIN_EMAIL = "admin@mediclinic.local"

passed = 0
failed = 0


def request(method, path, data=None, token=None, cookie=None):
    headers = {
        "Content-Type": "application/json",
        "Origin": ORIGIN
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if cookie:
        headers["Cookie"] = f"mediclinic_refresh={cookie}"

    body = json.dumps(data).encode() if data is not None else None

    req = Request(
        BASE_URL + path,
        data=body,
        headers=headers,
        method=method
    )

    try:
        response = urlopen(req, timeout=20)

    except HTTPError as error:
        response = error

    except URLError as error:
        raise RuntimeError(f"Không thể kết nối Backend: {error}")

    with response:
        raw = response.read().decode("utf-8")

        try:
            result = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            result = raw

        cookies = SimpleCookie()

        for value in response.headers.get_all("Set-Cookie", []):
            cookies.load(value)

        refresh = cookies.get("mediclinic_refresh")

        return (
            response.status,
            result,
            refresh.value if refresh else None
        )


def check(name, expected, actual):
    global passed, failed

    success = expected == actual

    if success:
        passed += 1
    else:
        failed += 1

    label = "PASS" if success else "FAIL"

    print(
        f"[{label}] {name} | "
        f"Expected: {expected} | Actual: {actual}"
    )

    return success


def login(email, password):
    return request(
        "POST",
        "/auth/login",
        {
            "email": email,
            "password": password
        }
    )


def main():
    admin_password = getpass.getpass("Admin password: ")

    print("\nMEDICLINIC ADVANCED USER MANAGEMENT TEST")
    print("=" * 70)

    status, admin, _ = login(ADMIN_EMAIL, admin_password)

    if not check("Admin Login", 200, status):
        return

    admin_token = admin["accessToken"]
    admin_id = admin["user"]["id"]

    suffix = uuid.uuid4().hex[:10]

    email = f"advanced.test.{suffix}@mediclinic.local"
    password = secrets.token_urlsafe(24)
    reset_password = secrets.token_urlsafe(24)
    changed_password = secrets.token_urlsafe(24)

    status, user, _ = request(
        "POST",
        "/users",
        {
            "fullName": "Nhân viên kiểm thử nâng cao",
            "email": email,
            "phone": "0901234567",
            "password": password,
            "roles": ["DOCTOR"]
        },
        token=admin_token
    )

    if not check("Create Test User", 201, status):
        return

    user_id = user["id"]
    user_path = f"/users/{user_id}"

    status, summary, _ = request(
        "GET",
        "/users/summary",
        token=admin_token
    )

    check("Get User Summary", 200, status)

    check(
        "Summary Contains Total Users",
        True,
        isinstance(summary, dict) and "totalUsers" in summary
    )

    status, user, _ = request(
        "PUT",
        user_path,
        {
            "fullName": "Bác sĩ đã cập nhật",
            "email": email,
            "phone": "0912345678"
        },
        token=admin_token
    )

    check("Update User", 200, status)

    check(
        "Updated Full Name",
        "Bác sĩ đã cập nhật",
        user.get("fullName") if isinstance(user, dict) else None
    )

    status, user, _ = request(
        "PUT",
        user_path,
        {
            "fullName": "Bác sĩ kiểm thử",
            "email": ADMIN_EMAIL,
            "phone": "0912345678"
        },
        token=admin_token
    )

    check("Update Duplicate Email", 409, status)

    status, doctor, doctor_cookie = login(email, password)

    if not check("Doctor Login", 200, status):
        return

    doctor_token = doctor["accessToken"]

    status, _, _ = request(
        "GET",
        "/users/summary",
        token=doctor_token
    )

    check("Doctor Cannot View Summary", 403, status)

    status, _, _ = request(
        "PATCH",
        user_path + "/status",
        {"active": False},
        token=doctor_token
    )

    check("Doctor Cannot Lock Account", 403, status)

    status, _, _ = request(
        "PUT",
        user_path + "/roles",
        {"roles": ["ADMIN"]},
        token=doctor_token
    )

    check("Doctor Cannot Assign Admin Role", 403, status)

    status, _, _ = request(
        "PATCH",
        f"/users/{admin_id}/status",
        {"active": False},
        token=admin_token
    )

    check("Admin Cannot Lock Own Account", 409, status)

    status, _, _ = request(
        "PUT",
        f"/users/{admin_id}/roles",
        {"roles": ["DOCTOR"]},
        token=admin_token
    )

    check("Admin Cannot Remove Own Admin Role", 409, status)

    status, user, _ = request(
        "PATCH",
        user_path + "/status",
        {"active": False},
        token=admin_token
    )

    check("Lock Doctor Account", 200, status)

    check(
        "Doctor Account Inactive",
        False,
        user.get("active") if isinstance(user, dict) else None
    )

    status, _, _ = request(
        "GET",
        "/auth/me",
        token=doctor_token
    )

    check("Locked Access Token Rejected", 401, status)

    status, _, _ = login(email, password)

    check("Locked Account Cannot Login", 401, status)

    status, _, _ = request(
        "PATCH",
        user_path + "/status",
        {"active": True},
        token=admin_token
    )

    check("Unlock Doctor Account", 200, status)

    status, _, _ = request(
        "GET",
        "/auth/me",
        token=doctor_token
    )

    check("Old Access Token After Unlock", 401, status)

    status, _, _ = request(
        "POST",
        "/auth/refresh",
        cookie=doctor_cookie
    )

    check("Old Refresh Token After Unlock", 401, status)

    status, doctor, doctor_cookie = login(email, password)

    if not check("Login After Unlock", 200, status):
        return

    doctor_token = doctor["accessToken"]

    status, user, _ = request(
        "PUT",
        user_path + "/roles",
        {"roles": ["RECEPTIONIST"]},
        token=admin_token
    )

    check("Update User Roles", 200, status)

    check(
        "Receptionist Role Assigned",
        True,
        isinstance(user, dict)
        and "RECEPTIONIST" in user.get("roles", [])
    )

    status, _, _ = request(
        "GET",
        "/auth/me",
        token=doctor_token
    )

    check("Old JWT After Role Change", 401, status)

    status, _, _ = request(
        "POST",
        "/auth/refresh",
        cookie=doctor_cookie
    )

    check("Old Refresh After Role Change", 401, status)

    status, employee, employee_cookie = login(email, password)

    if not check("Login After Role Change", 200, status):
        return

    employee_token = employee["accessToken"]

    status, _, _ = request(
        "POST",
        user_path + "/reset-password",
        {"newPassword": reset_password},
        token=admin_token
    )

    check("Admin Reset Password", 204, status)

    status, _, _ = request(
        "GET",
        "/auth/me",
        token=employee_token
    )

    check("Old JWT After Password Reset", 401, status)

    status, _, _ = request(
        "POST",
        "/auth/refresh",
        cookie=employee_cookie
    )

    check("Old Refresh After Password Reset", 401, status)

    status, _, _ = login(email, password)

    check("Old Password Rejected", 401, status)

    status, employee, employee_cookie = login(
        email,
        reset_password
    )

    if not check("Login With Reset Password", 200, status):
        return

    employee_token = employee["accessToken"]

    status, _, _ = request(
        "POST",
        "/auth/change-password",
        {
            "currentPassword": "incorrect-password",
            "newPassword": changed_password
        },
        token=employee_token
    )

    check("Wrong Current Password", 401, status)

    status, _, _ = request(
        "POST",
        "/auth/change-password",
        {
            "currentPassword": reset_password,
            "newPassword": changed_password
        },
        token=employee_token,
        cookie=employee_cookie
    )

    check("Change Own Password", 204, status)

    status, _, _ = request(
        "GET",
        "/auth/me",
        token=employee_token
    )

    check("Old JWT After Password Change", 401, status)

    status, _, _ = request(
        "POST",
        "/auth/refresh",
        cookie=employee_cookie
    )

    check("Old Refresh After Password Change", 401, status)

    status, _, _ = login(email, reset_password)

    check("Previous Password Rejected", 401, status)

    status, _, _ = login(email, changed_password)

    check("Login With Changed Password", 200, status)

    status, _, _ = request(
        "GET",
        "/users/9223372036854775807",
        token=admin_token
    )

    check("User Not Found", 404, status)

    status, _, _ = request(
        "PATCH",
        user_path + "/status",
        {"active": False},
        token=admin_token
    )

    check("Deactivate Test Account", 200, status)

    print("\nTest account:")
    print(f"ID: {user_id}")
    print(f"Email: {email}")
    print("Tài khoản kiểm thử được giữ lại ở trạng thái khóa.")


if __name__ == "__main__":
    try:
        main()

    except Exception as error:
        failed += 1
        print(f"\n[ERROR] {error}")

    finally:
        print("\n" + "=" * 70)
        print("ADVANCED USER MANAGEMENT TEST SUMMARY")
        print("=" * 70)
        print(f"Passed : {passed}")
        print(f"Failed : {failed}")
        print(f"Total  : {passed + failed}")

        if failed == 0 and passed == 39:
            print("\nALL TESTS PASSED")
            sys.exit(0)

        print("\nTESTS FAILED OR INCOMPLETE")
        sys.exit(1)
