from flask import Flask
from routes.inventory_routes import inventory_bp
from routes.recipe_routes import recipe_bp

app = Flask(__name__)

# Register Blueprints (API Routes)
app.register_blueprint(inventory_bp, url_prefix='/inventory')
app.register_blueprint(recipe_bp, url_prefix='/recipes')

if __name__ == "__main__":
    app.run(debug=True)
