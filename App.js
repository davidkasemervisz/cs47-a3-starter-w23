import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { FlatList, Pressable, View, Image, StyleSheet, SafeAreaView, Text } from "react-native";
import { useSpotifyAuth } from "./utils";
import { Themes } from "./assets/Themes";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';

const Stack = createStackNavigator();

const renderSong = ({item}, props) => {
  const navigation = props;
  const details_site = item.externalUrl;
  const preview_site = item.previewUrl;

  const millisToMinutesAndSeconds = (millis) => {
      const minutes = Math.floor(millis / 60000);
      const seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };

      return (
        <Pressable onPress={() => navigation.navigate("SongDetailsScreen", {site: details_site})}>
        <View style={styles.song_container}>
          <Pressable style={{width: "7.5%", height: "25%"}}
          onPress={() => {navigation.navigate("SongPreviewScreen", {site: preview_site})}}> 
            <Image 
              style = {{width: "100%", height: "100%", resizeMode: "contain"}}
              source = {require('./assets/Images/Spotify-Play-Button.png')}
            />
          </Pressable>
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
        </Pressable>
      );
    };

export default function App() {
  // Pass in true to useSpotifyAuth to use the album ID (in env.js) instead of top tracks
  const { token, tracks, getSpotifyAuth } = useSpotifyAuth(true);

const AlbumScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <View style= {styles.header}>
          <Image 
            style={{width: "20%", height: "100%", resizeMode: "contain"}} 
            source={require('./assets/Images/spotify-logo.png')} 
          />
          <Text style={{fontSize: 36, fontWeight: "bold"}}>My Top Tracks</Text>
        </View>
        <FlatList
          data = {tracks}
          renderItem = {(item) => renderSong(item, navigation)}
          keyExtractor = {(item) => item.songTitle}
        />
      </SafeAreaView>
  );
}

const SongDetailsScreen = ({navigation, route}) => {
  const site = route.params.site;
  console.log("site", site);

  return (
    <View style={{width: "100%", height: "100%"}}>
      <WebView
          source={{ uri: site }}
          style={{ width: '100%', height: '100%' }}
        />
    </View>
  );
};

const SongPreviewScreen = ({navigation, route}) => {
  const site = route.params.site;
  console.log("site", site);

  if(site == undefined) {
    return (
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text>No Preview Exists</Text>
      </View>
    )
  }

  else {
    return (
      <View style={{width: "100%", height: "100%"}}>
      <WebView
          source={{ uri: site }}
          style={{ width: '100%', height: '100%' }}
        />
    </View>
    );
  }
};

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
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="AlbumScreen" component={AlbumScreen} 
              options={{headerShown: false}} />
          <Stack.Screen name="SongDetailsScreen" component={SongDetailsScreen} />
          <Stack.Screen name="SongPreviewScreen" component={SongPreviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
