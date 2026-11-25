import json
import getpass
import urllib.request
import urllib.error
import http.cookiejar


BASE_URL = "http://127.0.0.1:8080/api/v1"

EMAIL = "admin@mediclinic.local"

ORIGIN = "http://127.0.0.1:5173"

cookie_jar = http.cookiejar.CookieJar()

opener = urllib.request.build_opener(
    urllib.request.HTTPCookieProcessor(cookie_jar)
)

passed = 0
failed = 0


def request(method, path, data=None, token=None):

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": ORIGIN
    }

    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = None

    if data is not None:
        body = json.dumps(data).encode("utf-8")

    req = urllib.request.Request(
        url=f"{BASE_URL}{path}",
        data=body,
        headers=headers,
        method=method
    )

    try:
        with opener.open(req, timeout=10) as response:
            status = response.status
            raw = response.read().decode("utf-8")

    except urllib.error.HTTPError as error:
        status = error.code
        raw = error.read().decode("utf-8")

    except urllib.error.URLError as error:
        raise RuntimeError(
            f"Không thể kết nối Backend: {error.reason}"
        ) from error

    try:
        result = json.loads(raw) if raw else {}

    except json.JSONDecodeError:
        result = {"message": raw}

    return status, result


def check(name, actual, expected):

    global passed, failed

    if actual == expected:

        passed += 1

        print(
            f"[PASS] {name} "
            f"| Expected: {expected} "
            f"| Actual: {actual}"
        )

        return True

    failed += 1

    print(
        f"[FAIL] {name} "
        f"| Expected: {expected} "
        f"| Actual: {actual}"
    )

    return False


def summary():

    print("\n" + "=" * 60)
    print("AUTHENTICATION TEST SUMMARY")
    print("=" * 60)

    print(f"Passed : {passed}")
    print(f"Failed : {failed}")
    print(f"Total  : {passed + failed}")

    if failed == 0:
        print("\nALL TESTS PASSED")
    else:
        print("\nSOME TESTS FAILED")


def main():

    password = getpass.getpass("Admin password: ")

    print("\nMEDICLINIC AUTHENTICATION TEST")
    print("=" * 60)

    # Test 1: Health Check
    status, _ = request("GET", "/health")

    if not check("Health Check", status, 200):
        return

    # Test 2: Unauthorized Patient API
    status, _ = request("GET", "/patients")

    check("Patient API without token", status, 401)

    # Test 3: Invalid Login
    status, _ = request(
        "POST",
        "/auth/login",
        {
            "email": EMAIL,
            "password": password + "_invalid"
        }
    )

    check("Invalid Login", status, 401)

    # Test 4: Valid Login
    status, login_data = request(
        "POST",
        "/auth/login",
        {
            "email": EMAIL,
            "password": password
        }
    )

    if not check("Valid Login", status, 200):
        print(login_data)
        return

    access_token = login_data.get("accessToken")

    user = login_data.get("user", {})

    if not check(
        "Access Token exists",
        bool(access_token),
        True
    ):
        return

    check(
        "Admin Role",
        "ADMIN" in user.get("roles", []),
        True
    )

    check(
        "Refresh Cookie exists",
        any(
            cookie.name == "mediclinic_refresh"
            for cookie in cookie_jar
        ),
        True
    )

    print("\nLogged-in user:")

    print(
        json.dumps(
            user,
            indent=4,
            ensure_ascii=False
        )
    )

    # Test 5: Auth Me
    status, _ = request(
        "GET",
        "/auth/me",
        token=access_token
    )

    check("Get Current User", status, 200)

    # Test 6: Authorized Patient API
    status, _ = request(
        "GET",
        "/patients",
        token=access_token
    )

    check("Patient API with JWT", status, 200)

    # Test 7: Invalid JWT
    status, _ = request(
        "GET",
        "/patients",
        token="invalid.jwt.token"
    )

    check("Invalid JWT", status, 401)

    # Test 8: Refresh Token
    status, refresh_data = request(
        "POST",
        "/auth/refresh"
    )

    if check("Refresh Token", status, 200):

        new_token = refresh_data.get("accessToken")

        if check(
            "Refreshed Access Token exists",
            bool(new_token),
            True
        ):

            status, _ = request(
                "GET",
                "/auth/me",
                token=new_token
            )

            check("Refreshed Access Token", status, 200)

    # Test 9: Logout
    status, _ = request(
        "POST",
        "/auth/logout"
    )

    check("Logout", status, 204)

    # Test 10: Refresh after Logout
    status, _ = request(
        "POST",
        "/auth/refresh"
    )

    check("Refresh after Logout", status, 401)


if __name__ == "__main__":

    try:
        main()

    except RuntimeError as error:
        failed += 1
        print(f"[ERROR] {error}")

    finally:
        summary()

    raise SystemExit(1 if failed else 0)