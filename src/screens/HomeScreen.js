// //homepage patilhardware
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import CommonHeader from '../components/CommonHeader';

// export default function HomeScreen({ navigation }) {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const Divider = () => <View style={styles.divider} />;

//   const getServices = async () => {
//     try {
//       const response = await fetch(
//         'https://patilhardware.com/MobileWeb/service',
//       );
//       const json = await response.json();
//       setServices(json?.post || []);
//     } catch (error) {
//       console.log('API Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getServices();
//   }, []);

//   return (
//     <SafeAreaView edges={['top']} style={styles.safeArea}>
//       {/* HEADER */}
//       <CommonHeader title="Patil Hardware" navigation={navigation} />

//       <Divider />

//       {/* BODY */}
//       <View style={styles.container}>
//         <FlatList
//           data={services}
//           numColumns={2}
//           keyExtractor={item => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View style={styles.itemWrapper}>
//               <TouchableOpacity
//                 style={styles.card}
//                 onPress={() =>
//                   navigation.navigate('ServiceRequest', {
//                     id: item.id,
//                     serviceName: item.title,
//                   })
//                 }
//               >
//                 <Image
//                   source={{
//                     uri: `https://patilhardware.com/adminassets/uplodes/service/${item.s_image}`,
//                   }}
//                   style={styles.image}
//                 />
//               </TouchableOpacity>

//               <Text style={styles.cardText}>{item.title}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FDFDFD',
//   },

//   header: {
//     height: 56,
//     backgroundColor: '#FDFDFD',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },

//   headerTitle: {
//     flex: 1,
//     color: '#000',
//     fontSize: 20,
//     fontWeight: '600',
//   },

//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#FDFDFD',
//   },

//   itemWrapper: {
//     flex: 1,
//     alignItems: 'center',
//     marginVertical: 12,
//   },

//   card: {
//     width: 160,
//     height: 130,
//     backgroundColor: '#EDEDED',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   image: {
//     width: 140,
//     height: 130,
//     resizeMode: 'contain',
//     borderRadius: 10,
//   },

//   cardText: {
//     marginTop: 8,
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//     textAlign: 'center',
//   },

//   divider: {
//     height: 1,
//     backgroundColor: '#EBEBEB',
//     width: '900',
//     marginLeft: -16,
//   },

//   menuout: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F07C00',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },

//   drawer: {
//     position: 'absolute',
//     right: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#1F3C88',
//     paddingTop: 40,
//     paddingHorizontal: 18,
//   },

//   drawerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },

//   drawerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   drawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//   },

//   drawerText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     marginLeft: 12,
//     fontWeight: '500',
//   },

//   requestStatus: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: '#F07C00',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });







import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import CommonHeader from "../components/CommonHeader";

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServices = async () => {
    try {
      const response = await fetch(
        "https://patilhardware.com/MobileWeb/service"
      );
      const json = await response.json();
      setServices(json?.post || []);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.cardWrapper}
      onPress={() =>
        navigation.navigate("ServiceRequest", {
          id: item.id,
          serviceName: item.title,
        })
      }
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://patilhardware.com/adminassets/uplodes/service/${item.s_image}`,
          }}
          style={styles.image}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        >
          <Text numberOfLines={2} style={styles.cardText}>
            {item.title}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ✅ COMMON HEADER (Drawer working) */}
      <CommonHeader title="Patil Hardware" navigation={navigation} />

      {/* ✅ PREMIUM BANNER */}
      <LinearGradient
        colors={["#F07C00", "#FFB347"]}
        style={styles.banner}
      >
        <Text style={styles.heading}>Find Your Service 🔧</Text>
        <Text style={styles.subText}>Fast • Reliable • Trusted</Text>
      </LinearGradient>

      {/* BODY */}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#F07C00" />
        ) : (
          <FlatList
            data={services}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: 10,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  banner: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 18,

    // shadow
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  subText: {
    fontSize: 13,
    color: "#fff",
    marginTop: 4,
    opacity: 0.9,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },

  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },

  card: {
    height: 160,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",

    // premium shadow
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },

  cardText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});