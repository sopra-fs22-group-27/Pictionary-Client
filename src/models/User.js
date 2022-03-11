/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.password = null;
    this.username = null;
    this.creation_date = null;
    this.birthday = null;
    this.logged_in = true;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}
export default User;
