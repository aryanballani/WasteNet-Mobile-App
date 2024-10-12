class Inventory:
    def __init__(self):
        self.items = {}

    def add_item(self, name, quantity, expiry_date):
        self.items[name] = {'quantity': quantity, 'expiry_date': expiry_date}

    def update_item(self, name, used_quantity):
        if name in self.items:
            self.items[name]['quantity'] -= used_quantity
            if self.items[name]['quantity'] <= 0:
                del self.items[name]

    def get_items(self):
        return self.items
