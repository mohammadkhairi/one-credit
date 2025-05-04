
import EnvironmentConfig from '../types/EnvironmentType'


function generateMongoUri(credentials: EnvironmentConfig): string {
    const { host, port, db, username, password } = credentials;
  
    if (username != undefined && password != undefined) {
      return `mongodb://${username}:${password}@${host}:${port}/${db}`;
    } else {
      return `mongodb://${host}:${port}/${db}`;
    }
  }
  
  export default generateMongoUri;