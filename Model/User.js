const Purchase = require("./Purchase");
class User {
  constructor(
    id,
    username,
    password,
    name,
    lastname,
    gender,
    birthDate,
    role,
    purchases,
    cart,
    factory,
    points,
    customerType,
    suspicious,
    blocked
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.lastname = lastname;
    this.gender = gender;
    this.birthDate = birthDate;
    this.role = role;
    this.purchases = purchases;
    this.cart = cart;
    this.factory = factory;
    this.points = points;
    this.customerType = customerType;
    this.suspicious = suspicious;
    this.blocked = blocked;
  }

  static fromJSON(json) {
    const {
      id,
      username,
      password,
      name,
      lastname,
      gender,
      birthDate,
      role,
      purchases,
      cart,
      factory,
      points,
      customerType,
      suspicious,
      blocked,
    } = json;
    const purchasesIds = purchases || [];
    return new User(
      id,
      username,
      password,
      name,
      lastname,
      gender,
      birthDate,
      role,
      purchasesIds,
      cart,
      factory,
      points,
      customerType,
      suspicious,
      blocked
    );
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      name: this.name,
      lastname: this.lastname,
      gender: this.gender,
      birthDate: this.birthDate,
      role: this.role,
      purchases: this.purchases,
      cart: this.cart,
      factory: this.factory,
      points: this.points,
      customerType: this.customerType,
      suspicious: this.suspicious,
      blocked: this.blocked,
    };
  }
}

module.exports = User;
