import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const regionKeyMap = {
  Central: "central",
  North: "northern",
  Northeastern: "northeastern",
  South: "southern",
};


  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      const docRef = doc(db, "thai_food_guide", "central");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const menus = docSnap.data().menus || [];
        const filtered = menus.filter((item) => item.recommend === "yes");
        setRecommendedDishes(filtered);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const nextLng = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(nextLng);
  };

  const handleLogin = () => {
    navigation.navigate("Login"); // ใช้กับ Expo AuthSession
  };

  return (
    <ScrollView key={i18n.language} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Thai Food Guide</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.langSwitch}>
              {i18n.language === "en" ? "中文" : "EN"}
            </Text>
          </TouchableOpacity>

          {/* ปุ่ม Login ด้วย Google / Facebook */}
          <TouchableOpacity onPress={handleLogin}>
            <FontAwesome name="google" size={28} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin}>
            <FontAwesome name="facebook" size={28} color="#3b5998" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput placeholder={t("search")} style={styles.searchInput} />
      </View>

      {/* Explore by Region */}
      <Text style={styles.sectionTitle}>🍽️ {t("explore_by_region")}</Text>
      <View style={styles.grid}>
        {["Central", "North", "Northeastern", "South"].map((region, i) => (
          <TouchableOpacity
            key={i}
            style={styles.regionButton}
            onPress={() => navigation.navigate("RegionMenu", { region: regionKeyMap[region] 
              })
            }
          >
            <Text style={styles.regionText}>{t(region.toLowerCase())}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended */}
      <Text style={styles.sectionTitle}>⭐ {t("recommended")}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendedDishes.map((dish, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <Image
                source={{ uri: dish.image_detail_url }}
                style={styles.cardImage}
              />
              <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
                {i18n.language === "zh" ? dish.dish_zh : dish.dish_en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Map Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={styles.buttonText}>📍 {t("find_nearby")}</Text>
      </TouchableOpacity>

      {/* Favorites Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Favorites")}
      >
        <Text style={styles.buttonText}>❤️ {t("favorites")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  langSwitch: {
    fontSize: 16,
    marginRight: 8,
    color: "#007AFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  regionButton: {
    width: "48%",
    backgroundColor: "#E6F0FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  regionText: {
    fontWeight: "500",
  },
  card: {
    width: 160,
    marginRight: 12,
    alignItems: "center",
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFE6E6",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
