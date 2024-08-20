const fs = require("fs");
const path = require("path");
const User = require("../Model/User");

class UserDAO {
  constructor() {
    this.filePath = path.join(__dirname, "..", "Database/users.json");
    this.users = this.loadUsers();
  }

  loadUsers() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf8");
      const json = JSON.parse(data);
      return json.map((user) => User.fromJSON(user));
    }
    return [];
  }

  setToSuspicious(username) {
    let user = this.getByUsername(username);
    user.suspicious = true;

    console.log(user);

    this.update(user);
  }

  filter(role) {
    return this.users.filter((user) => user.role === role);
  }

  filterByCustomerType(customerType) {
    return this.users.filter((user) => user.customerType === customerType);
  }

  save() {
    const json = this.users.map((user) => user.toJSON());
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 4), "utf8");
  }

  add(user) {
    const id =
      this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
    user.id = id;
    this.users.push(user);
    this.save();
    return user;
  }

  getAllSuspicious() {
    return this.users.filter((user) => user.suspicious === true);
  }

  getAllBlocked() {
    return this.users.filter((user) => user.blocked === true);
  }

  getByUsername(username) {
    return this.users.find((user) => user.username === username) || null;
  }

  getAll() {
    return this.users;
  }

  getById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  getBySearchParameters(users, username, firstName, lastName) {
    try {
      const result = users.filter((user) => {
        const matchUsername =
          !username ||
          user.username.toLowerCase().includes(username.toLowerCase());
        const matchFirstName =
          !firstName ||
          user.name.toLowerCase().includes(firstName.toLowerCase());
        const matchLastName =
          !lastName ||
          user.lastname.toLowerCase().includes(lastName.toLowerCase());
        return matchUsername && matchFirstName && matchLastName;
      });
      return result;
    } catch (error) {
      console.error("Error in getBySearchParameters:", error);
      throw error;
    }
  }

  getSorted(sortParam, users) {
    return users.sort((a, b) => {
      const aValue = a[sortParam];
      const bValue = b[sortParam];

      // Handle undefined and null values
      if (aValue === undefined || aValue === null) {
        return 1;
      }
      if (bValue === undefined || bValue === null) {
        return -1;
      }

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return aValue - bValue;
      }

      const aString = aValue.toString().toLowerCase();
      const bString = bValue.toString().toLowerCase();

      if (aString < bString) {
        return -1;
      }
      if (aString > bString) {
        return 1;
      }
      return 0;
    });
  }

  getDescendingSorted(sortParam, users) {
    return users.sort((a, b) => {
      const aValue = a[sortParam];
      const bValue = b[sortParam];

      // Handle undefined and null values
      if (aValue === undefined || aValue === null) {
        return 1;
      }
      if (bValue === undefined || bValue === null) {
        return -1;
      }

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return bValue - aValue;
      }

      const aString = aValue.toString().toLowerCase();
      const bString = bValue.toString().toLowerCase();

      if (aString < bString) {
        return 1;
      }
      if (aString > bString) {
        return -1;
      }
      return 0;
    });
  }

  update(updatedUser) {
    const id = updatedUser.id;
    if (!id) {
      throw new Error("ID is required to update a user");
    }
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return null;
    }

    const existingUser = this.users[index];

    const points =
      updatedUser.points !== undefined
        ? updatedUser.points
        : existingUser.points;

    this.users[index] = new User(
      existingUser.id,
      updatedUser.username || existingUser.username,
      updatedUser.password || existingUser.password,
      updatedUser.name || existingUser.name,
      updatedUser.lastname || existingUser.lastname,
      updatedUser.gender || existingUser.gender,
      updatedUser.birthDate || existingUser.birthDate,
      updatedUser.role || existingUser.role,
      updatedUser.purchases || existingUser.purchases,
      updatedUser.cart || existingUser.cart,
      updatedUser.factory || existingUser.factory,
      points,
      updatedUser.customerType || existingUser.customerType,
      updatedUser.suspicious,
      updatedUser.blocked || existingUser.blocked
    );

    if (this.users[index].points >= 100) {
      this.users[index].customerType = "Gold";
    } else if (this.users[index].points >= 50) {
      this.users[index].customerType = "Silver";
    } else {
      this.users[index].customerType = "Bronze";
    }

    this.save();
    return this.users[index];
  }

  delete(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1);
      this.save();
      return deletedUser[0];
    }
    return false;
  }
}

module.exports = UserDAO;
