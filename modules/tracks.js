
import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'
import mm from 'music-metadata'
import util from 'util'


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
        duration INTEGER,\
        mp3file TEXT,\
        tags TEXT,\
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
        if(tracks[index].art === null) tracks[index].art = 'https://orlando-road.codio-box.uk/public/data/testimage.jpg'
        const seconds = tracks[index].duration
        const min = Math.floor(seconds % 3600 / 60)
        const sec = Math.floor(seconds % 3600 % 60)
        tracks[index].duration = min + ":" + sec
    }
    return tracks
  }
    
    
   async getByID(id) {
       try {
           const sql = `SELECT users.user, tracks.* FROM tracks, users\
                        WHERE tracks.userid = users.id AND tracks.id = ${id};`
           console.log(sql)
           const track = await this.db.get(sql)
           const tracks = await this.db.all(sql)
           if(track.art === null) track.art = 'avatar.png'
           const seconds = tracks.duration
           const min = Math.floor(seconds % 3600 / 60)
           const sec = Math.floor(seconds % 3600 % 60)
           tracks.duration = min + ":" + sec
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
        let metadata
        let tags
        let mp3path
        if(data.fileName) {
            filename=`${Date.now()}.${mime.extension(data.fileType)}`
            console.log(filename)
            metadata = await mm.parseFile(data.filePath)
            const options = { showHidden: false, depth: null }
            tags = util.inspect(metadata, options)
            mp3path = filename
            await fs.copy(data.filePath, `public/data/${filename}`)
        }
        try {
            const picture = metadata.common.picture[0]
            const ext = mime.extension(picture.format)
            const artwork = picture.data
            const buffer = Buffer.from(artwork, 'base64')
            const title = metadata.common.title.split(' ').join('_')
			const artist = metadata.common.artist.split(' ').join(' ')
            const duration = metadata.format.duration
            await fs.writeFile(`data/${title}.${ext}`, buffer)
            await fs.writeFile(`data/${title}.txt`, tags)
            const sql = `INSERT INTO tracks(userid, name, artist, art, duration, mp3file, tags)\
                            VALUES(${data.account}, "${title}", 
                                "${artist}","${title}.${ext}", "${duration}", "${mp3path}","${title}.txt")`   
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



