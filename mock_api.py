"""
mock_api.py — Локальный мок-сервер для скриншотов ПР №3
=======================================================
Запуск: python mock_api.py
Сервер на http://localhost:1236
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

class MockHandler(BaseHTTPRequestHandler):
    
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())
    
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, token')
        self.end_headers()
    
    def do_POST(self):
        path = urlparse(self.path).path
        
        if '/user/login' in path:
            self.send_json({
                "code": "200",
                "msg": "登录成功",
                "data": {
                    "id": 1,
                    "username": "admin",
                    "token": "mock-token-12345",
                    "role": "admin"
                }
            })
        elif '/user/add' in path:
            self.send_json({
                "code": "200",
                "msg": "注册成功",
                "data": {"id": 10}
            })
        elif '/scenic/add' in path:
            self.send_json({
                "code": "200",
                "msg": "添加成功",
                "data": {"id": 5}
            })
        elif '/order' in path and '/pay' not in path:
            self.send_json({
                "code": "200",
                "msg": "创建成功",
                "data": {"id": 100, "status": "未支付"}
            })
        elif '/pay' in path:
            self.send_json({
                "code": "200",
                "msg": "支付成功",
                "data": {"status": "已支付"}
            })
        else:
            self.send_json({"code": "404", "msg": "Not found"}, 404)
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if '/scenic/page' in path:
            self.send_json({
                "code": "200",
                "data": {
                    "records": [
                        {"id": 1, "name": "Золотые ворота", "category": "Исторические"},
                        {"id": 2, "name": "Успенский собор", "category": "Исторические"},
                        {"id": 3, "name": "Парк культуры", "category": "Парки"},
                    ],
                    "total": 3,
                    "size": 10,
                    "current": 1
                }
            })
        elif '/scenic/all' in path:
            self.send_json({
                "code": "200",
                "data": [
                    {"id": 1, "name": "Золотые ворота"},
                    {"id": 2, "name": "Успенский собор"},
                ]
            })
        elif '/scenic-category/tree' in path:
            self.send_json({
                "code": "200",
                "data": [
                    {"id": 1, "name": "Исторические", "children": []},
                    {"id": 2, "name": "Парки", "children": []},
                ]
            })
        elif '/guide/page' in path:
            self.send_json({
                "code": "200", "data": {"records": [], "total": 0}
            })
        elif '/comment/page' in path:
            self.send_json({
                "code": "200", "data": {"records": [], "total": 0}
            })
        elif '/ticket/scenic' in path:
            self.send_json({
                "code": "200",
                "data": [
                    {"id": 1, "type": "Взрослый", "price": 500, "quantity": 100},
                    {"id": 2, "type": "Детский", "price": 250, "quantity": 50},
                ]
            })
        elif '/carousel/active' in path:
            self.send_json({
                "code": "200", "data": []
            })
        elif '/user/current' in path or '/user/' in path:
            self.send_json({
                "code": "200",
                "data": {"id": 1, "username": "admin", "email": "admin@test.ru"}
            })
        else:
            self.send_json({"code": "404", "msg": "Not found"}, 404)
    
    def do_PUT(self):
        self.send_json({"code": "200", "msg": "更新成功"})
    
    def do_DELETE(self):
        self.send_json({"code": "200", "msg": "删除成功"})
    
    def log_message(self, format, *args):
        print(f'  {args[0]} {args[1]} -> {args[2]}')


def run():
    port = 1236
    server = HTTPServer(('localhost', port), MockHandler)
    print(f'[MOCK API] Запущен на http://localhost:{port}')
    print(f'[MOCK API] Эндпоинты для скриншотов:')
    print(f'   POST /api/user/login')
    print(f'   GET  /api/scenic/page')
    print(f'   POST /api/order')
    print(f'   GET  /api/scenic-category/tree')
    print('=' * 40)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n[*] Сервер остановлен')
        server.server_close()

if __name__ == '__main__':
    run()
