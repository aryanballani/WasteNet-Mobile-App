from flask import Flask         # type: ignore
from routes.inventory_routes import inventory_bp
from routes.recipe_routes import recipe_bp
from routes.user_routes import user_bp

app = Flask(__name__)

# Register Blueprints (API Routes)
# app.register_blueprint(inventory_bp, url_prefix='/inventory')
app.register_blueprint(recipe_bp, url_prefix='/recipes')
app.register_blueprint(user_bp, url_prefix='/users')


if __name__ == "__main__":
    app.run(debug=True)
