import { FlatList, Pressable, View, Image, StyleSheet, SafeAreaView, Text } from "react-native";
import { useSpotifyAuth } from "./utils";
import { Themes } from "./assets/Themes";

export default function App() {
  // Pass in true to useSpotifyAuth to use the album ID (in env.js) instead of top tracks
  const { token, tracks, getSpotifyAuth } = useSpotifyAuth(true);

  console.log("tracks", tracks);

  if(token == "") { // authenticate button 
    return (
      <SafeAreaView style = {styles.container}>
        <Pressable style={styles.authenticate_button}
          onPress={getSpotifyAuth}>
          <Image 
            style={{width: "20%", height: "100%", resizeMode: "contain"}} 
            source={require('./assets/Images/spotify-logo.png')} 
          />
          <Text style={{color: "white", fontSize: 24}}>Connect With Spotify</Text>
        </Pressable>
      </SafeAreaView>
    );
  } 
  
  else { // display songs
    const song_index = (title) => {
      for(var i = 0; i < tracks.length; i++) {
        if(tracks[i].songTitle == title) {
          return i+1;
        }
      }

      return -1;
    }

    const millisToMinutesAndSeconds = (millis) => {
      const minutes = Math.floor(millis / 60000);
      const seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };

    const renderSong = ({item}) => {
      console.log('items', item)
      return (
        <View style={styles.song_container}>
          <Text style={{color: "white", padding: 4}}>
            {song_index(item.songTitle)}
          </Text>
          <Image 
            style={{width: "20%", height: "100%", resizeMode: "contain"}} 
            source={{uri: item.imageUrl}} 
          />
          <View style={styles.title_author}>
            <Text style={{color: "white", fontSize: 12}}>
              {item.songArtists[0].name}
            </Text>
            <Text style={{color:"white", fontSize: 12}}>
              {item.songTitle}
            </Text>
          </View>
          <View style={styles.title_author}>
            <Text style={{color: "white", fontSize: 12, padding: 4}}>
              {item.albumName}
            </Text>
          </View>
          <View>
            <Text style={{color:"white", fontSize: 12, padding: 4}}>
              {millisToMinutesAndSeconds(item.duration)}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <SafeAreaView style = {styles.container}>
        <View style= {styles.header}>
          <Image 
            style={{width: "20%", height: "100%", resizeMode: "contain"}} 
            source={require('./assets/Images/spotify-logo.png')} 
          />
          <Text style={{fontSize: 36, fontWeight: "bold"}}>My Top Tracks</Text>
        </View>
        <FlatList
          data = {tracks}
          renderItem = {(item) => renderSong(item)}
          keyExtractor = {(item) => item.songTitle}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  authenticate_button: {
    width: "90%",
    height:"8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#1DB954",
  },
  song_container: {
    width: 350,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  header: {
    width: "100%",
    height: "10%",
    backgroundColor: "#404040",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title_author: {
    flexDirection: "column",
    flex: 1,
    padding: 4,
  }
});
