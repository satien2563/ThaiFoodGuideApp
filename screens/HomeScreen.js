import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก Firestore
  const fetchRecommended = async () => {
    try {
      const docRef = doc(db, 'thai_food_guide', 'central');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const menus = docSnap.data().menus || [];
        const filtered = menus.filter((item) => item.recommend === 'yes');
        setRecommendedDishes(filtered);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thai Food Guide</Text>
      <Text style={styles.sectionTitle}>{t('recommended')}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedDishes.map((dish, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <Image
                source={{ uri: dish.image_detail_url }}
                style={styles.image}
              />
              <Text style={styles.dishText}>{dish.dish_en}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    marginRight: 12,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  dishText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
