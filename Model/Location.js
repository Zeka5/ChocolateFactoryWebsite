class Location {
    constructor(longitude, latitude, street, number, city, postalCode) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.street = street;
        this.number = number;
        this.city = city;
        this.postalCode = postalCode;
    }
    
    getAddress(){
        return `${this.street} ${this.number}, ${this.city}, ${this.postalCode}`;
    }

    setAddress(street, number, city, postalCode) {
        this.street = street;
        this.number = number;
        this.city = city;
        this.postalCode = postalCode;
    }
    

  static fromJSON(json) {
    const { longitude, latitude, street, number, city, postalCode } = json;
    return new Location(longitude, latitude, street, number, city, postalCode);
  }

  toJSON() {
    return {
        longitude: this.longitude,
        latitude: this.latitude,
        street: this.street,
        number: this.number,
        city: this.city,
        postalCode: this.postalCode
    };
  }
}

module.exports = Location;