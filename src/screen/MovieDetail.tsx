import React, { useEffect, useState } from 'react';
import { Button, View, Text, StyleSheet, ImageBackground, ActivityIndicator, ScrollView, FlatList, TouchableOpacity } from "react-native";
import {API_URL, API_ACCESS_TOKEN} from '@env'
import { FontAwesome } from '@expo/vector-icons';
import { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id, coverType } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetail();
    checkIfFavorite();
  }, [id]);

  const fetchMovieDetail = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await fetchFromApi(`https://api.themoviedb.org/3/movie/${id}`);
      setMovie(movieData);
      const recommendationData = await fetchFromApi(`https://api.themoviedb.org/3/movie/${id}/recommendations`);
      setRecommendations(recommendationData.results);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFromApi = async (url: string): Promise<any> => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = [...favMovieList, movie];
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = favMovieList.filter((movie) => movie.id !== id);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfFavorite = async (): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      const favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      const isFav = favMovieList.some((movie) => movie.id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = (): void => {
    if (movie) {
      if (isFavorite) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${coverType === 'backdrop' ? movie?.backdrop_path : movie?.poster_path}`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={styles.movieTitle}>{movie?.title}</Text>
          <View style={styles.ratingFavoriteContainer}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{movie?.vote_average.toFixed(1)}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="pink" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.detailContainer}>
        <Text style={styles.overview}>{movie?.overview}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>Original Language</Text>
            <Text style={styles.gridValue}>{movie?.original_language}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>Popularity</Text>
            <Text style={styles.gridValue}>{movie?.popularity.toFixed(2)}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>Release Date</Text>
            <Text style={styles.gridValue}>
              {movie?.release_date ? new Date(movie.release_date).toDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridTitle}>Vote Count</Text>
            <Text style={styles.gridValue}>{movie?.vote_count}</Text>
          </View>
        </View>
      </View>
      <View style={styles.recommendationsContainer}>
        <View style={styles.recommendationHeader}>
          <View style={styles.purpleLabel}></View>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
        </View>
        <FlatList
          horizontal
          data={recommendations}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={{ width: 100, height: 160 }}
              coverType="poster"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 300,
  },
  movieTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingFavoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
  detailContainer: {
    padding: 16,
    width: '100%',
  },
  overview: {
    fontSize: 16,
    marginVertical: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 14,
  },
  recommendationsContainer: {
    width: '100%',
    paddingLeft: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieDetail;