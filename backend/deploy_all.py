import os
import subprocess
import time

base_dir = "."

for root, dirs, files in os.walk(base_dir):
    if "serverless.yaml" in files:
        print(f"Encontrado archivo serverless.yaml en: {root}")
        
        subprocess.run(["serverless", "deploy", "--stage", "dev"], cwd=root)
        subprocess.run(["serverless", "deploy", "--stage", "test"], cwd=root)
        subprocess.run(["serverless", "deploy", "--stage", "prod"], cwd=root)
        time.sleep(1)
