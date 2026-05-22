import os
import sys
import paramiko

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    "1.117.70.56",
    username="ubuntu",
    password=os.environ["DEPLOY_PASSWORD"],
    timeout=20,
)

_, stdout, _ = client.exec_command("sudo iptables -L YJ-FIREWALL-INPUT -n --line-numbers")
stdout.channel.recv_exit_status()
print(stdout.read().decode("utf-8", errors="replace"))
client.close()
