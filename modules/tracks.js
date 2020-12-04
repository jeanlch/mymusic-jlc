
import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'

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
        if(tracks[index].art === null) tracks[index].art = 'https://orlando-road.codio-box.uk/public/avatars/avatar.png'
    }
    return tracks
  }
    
    
   async getByID(id) {
       try {
           const sql = `SELECT users.user, tracks.* FROM tracks, users\
                        WHERE tracks.userid = users.id AND tracks.id = ${id};`
           console.log(sql)
           const track = await this.db.get(sql)
           if(track.art === null) track.art = 'avatar.png'
           return track
       }   catch(err) {
           console.log(err)
               throw(err)
           }
       }
   
 
    async add(data){
        console.log('ADD')
        console.log(data)
        let filename
        if(data.fileName) {
            filename=`${Date.now()}.${mime.extension(data.fileType)}`
            console.log(filename)
            await fs.copy(data.filePath, `public/data/${filename}`)
        }
        try {
            const sql = `INSERT INTO tracks(userid, name, artist, art, durationm, durations)\
                            VALUES(${data.account}, "${data.name}", "${data.artist}","${filename}","${data.durationm}","${data.durations}")`    
            console.log(sql)
            await this.db.run(sql)
            return true }
        catch(err) {
            console.log(err)
            throw(err)
        }
    }
    
    async close () {
        await this.db.close()
    }
}

export default Tracks