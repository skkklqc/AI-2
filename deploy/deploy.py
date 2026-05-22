import os
import sys
import tarfile
import tempfile
from pathlib import Path

import paramiko

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SERVER = "1.117.70.56"
USER = "ubuntu"
PASSWORD = os.environ["DEPLOY_PASSWORD"]
REMOTE_DIR = "/home/ubuntu/salary-calculator"
PROJECT_ROOT = Path(__file__).resolve().parents[1]


def run(client, command):
    print(f"$ {command}")
    _, stdout, stderr = client.exec_command(command, get_pty=True)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    if out.strip():
        print(out.encode("utf-8", errors="replace").decode("utf-8", errors="replace").rstrip())
    if err.strip():
        print(err.encode("utf-8", errors="replace").decode("utf-8", errors="replace").rstrip(), file=sys.stderr)
    if exit_code != 0:
        raise RuntimeError(f"Command failed ({exit_code}): {command}")
    return out


def main():
    archive_path = Path(tempfile.gettempdir()) / "salary-calculator-deploy.tar.gz"
    exclude = {"node_modules", ".git", "frontend/dist"}

    print("==> Packaging project...")
    if archive_path.exists():
        archive_path.unlink()

    with tarfile.open(archive_path, "w:gz") as tar:
        for path in PROJECT_ROOT.rglob("*"):
            if any(part in exclude for part in path.parts):
                continue
            if path.is_file():
                tar.add(path, arcname=path.relative_to(PROJECT_ROOT))

    print("==> Connecting to server...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER, username=USER, password=PASSWORD, timeout=20)

    sftp = client.open_sftp()
    try:
        print("==> Uploading archive...")
        run(client, f"mkdir -p {REMOTE_DIR}")
        sftp.put(str(archive_path), "/tmp/salary-calculator-deploy.tar.gz")

        print("==> Extracting and running setup...")
        run(
            client,
            " && ".join(
                [
                    f"mkdir -p {REMOTE_DIR}",
                    "tar -xzf /tmp/salary-calculator-deploy.tar.gz -C "
                    f"{REMOTE_DIR}",
                    f"chmod +x {REMOTE_DIR}/deploy/server-setup.sh",
                    f"sed -i 's/\\r$//' {REMOTE_DIR}/deploy/server-setup.sh",
                    f"bash {REMOTE_DIR}/deploy/server-setup.sh",
                ]
            ),
        )
    finally:
        sftp.close()
        client.close()

    print("\nDone! Visit http://1.117.70.56:3001")


if __name__ == "__main__":
    main()
