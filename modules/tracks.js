import sqlite from 'sqlite-async'

class Tracks {
  constructor(dbName = ':memory') {
    return (async() => {
      this.db = await sqlite.open(dbName)
      const sql = 'CREATE TABLE IF NOT EXISTS tracks(\
        id INTEGER PRIMARY KEY AUTOINCREMENT,\
        userid INTEGER,\
        name TEXT,\
        artist TEXT,\
        art TEXT,\
        durationm INTEGER,\
        durations INTEGER,\
        FOREIGN KEY(userid) REFERENCES users(id)\
      );'
      await this.db.run(sql)
      return this
    })()
  }
  
  /*method to display the tracks once the user has logged in*/
  async all() {
    const sql = 'SELECT users.user, tracks.* FROM tracks, users\
                  WHERE tracks.userid = users.id;'
    const tracks = await this.db.all(sql)
    for (const index in tracks) {
        if(tracks[index].art === null) tracks[index].art = 'avatar.png'
    }
    return tracks
  }
 
    async add(data){
        console.log('ADD')
        console.log(data)
        return true
    }
    
    async close () {
        await this.db.close()
    }
}

export default Tracks