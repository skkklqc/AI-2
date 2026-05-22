import os
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    "1.117.70.56",
    username="ubuntu",
    password=os.environ.get("DEPLOY_PASSWORD", "Liuqichang123"),
    timeout=20,
)
cmds = [
    "git -C /home/ubuntu/campus-used-book-platform remote -v 2>/dev/null || true",
    "git -C /home/ubuntu/campus-used-book-platform config user.name 2>/dev/null || true",
    "ls /home/ubuntu/.ssh/*.pub 2>/dev/null || true",
]
for cmd in cmds:
    print(">", cmd)
    _, o, _ = client.exec_command(cmd)
    o.channel.recv_exit_status()
    print(o.read().decode("utf-8", errors="replace").strip())
    print("---")
client.close()
