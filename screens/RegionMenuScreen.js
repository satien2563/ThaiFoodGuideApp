import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function RegionMenuScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { region } = route.params;

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState(null); // null = ทั้งหมด

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const docRef = doc(db, "thai_food_guide", region);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().menus || [];
          setMenus(data);
        }
      } catch (error) {
        console.error("Error loading region menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [region]);

  const getRegionTitle = () => {
    return (
      {
        central: t("central"),
        north: t("north"),
        northeastern: t("northeastern"),
        south: t("south"),
      }[region] || region
    );
  };

  // 🔍 แยกระดับเผ็ดจาก "(3) Hot"
  const parseSpicyLevel = (levelStr) => {
    const match = levelStr?.match(/\((\d)\)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const filteredMenus = menus.filter((dish) => {
    const level = parseSpicyLevel(dish.spicy_level);
    return filterLevel === null || level === filterLevel;
  });

  const levels = [
    { value: null, label: "all" },
    { value: 0, label: "not_spicy" },
    { value: 1, label: "mild" },
    { value: 2, label: "medium" },
    { value: 3, label: "hot" },
    { value: 4, label: "very_hot" },
    { value: 5, label: "extra_hot" },
  ];

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{getRegionTitle()}</Text>
      </View>

      {/* 🔸 Filter Buttons */}
      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {levels.map(({ value, label }) => (
            <TouchableOpacity
              key={label}
              onPress={() => setFilterLevel(value)}
              style={[
                styles.filterBtn,
                filterLevel === value && styles.filterBtnActive,
              ]}
            >
              <Text
                style={
                  filterLevel === value
                    ? styles.filterTextActive
                    : styles.filterText
                }
              >
                {t(label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 🔹 Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.menuList}>
          {filteredMenus.map((dish, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{ uri: dish.image_detail_url }}
                style={styles.image}
              />
              <Text
                style={styles.cardText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {i18n.language === "zh" ? dish.dish_zh : dish.dish_en}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 48 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 12 },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 8,
    alignItems: "center", // ✅ ป้องกันยืดแนวดิ่ง
    justifyContent: "flex-start", // ✅ เรียงจากซ้าย
    flexGrow: 0, // ✅ ไม่ขยายตามความสูงหน้าจอ
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
    height: 34, // ✅ ป้องกันยืดแนวสูง
    justifyContent: "center", // ✅ จัดข้อความให้อยู่กลาง
  },
  filterBtnActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    color: "#333",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#fff",
    fontSize: 14,
  },

  menuList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 8,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
