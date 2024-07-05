from django.core.management import execute_from_command_line
import os

if __name__ == "__main__":
    os.environ['DJANGO_SETTINGS_MODULE'] = 'myproject.settings'
    args = ['manage.py', 'runserver', 'localhost:8001', '--noreload']  # 可以添加更多参数，例如端口号
    execute_from_command_line(args)
