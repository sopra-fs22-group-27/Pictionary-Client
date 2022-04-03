/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.password = null;
    this.username = null;
    this.creation_date = null;
    this.email = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default User;
