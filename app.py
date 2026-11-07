"""Entrada compatível com python app.py, flask run e o WSGI existente."""

from backend.app import app, SECRET_KEY

if __name__ == "__main__":
    app.run(debug=True)
