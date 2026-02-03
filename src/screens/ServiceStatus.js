// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from "react-native-vector-icons/Feather";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// export default function ServiceStatus() {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkStorage = async () => {
//       const keys = await AsyncStorage.getAllKeys();
//       const userid = await AsyncStorage.getItem("userid");

//       console.log("STORAGE KEYS:", keys);
//       console.log("MOBILE FROM STORAGE:", mobile);
//     };

//     checkStorage();
//   }, []);

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const Divider = () => <View style={styles.divider} />;

//   const getRequests = async () => {

//     try {

//       setLoading(true);

//       const formData = new FormData();
//       const userid = await AsyncStorage.getItem("userid");

//       formData.append("uniqueid", userid); // static

//       console.log("Sending uniqueid:", userid);

//       const res = await axios.post(

//         "https://patilhardware.com/MobileWeb/userPreviousRequests",

//         formData,

//         {

//           headers: {

//             "Content-Type": "multipart/form-data",

//           },

//         }

//       );

//       console.log("API RESPONSE:", res.data);

//       if (Array.isArray(res.data?.post)) {

//         setData(res.data.post);

//       } else {

//         setData([]);

//       }

//     } catch (error) {

//       console.log("API ERROR:", error.response?.data || error.message);

//       setData([]);

//     } finally {

//       setLoading(false);

//     }

//   };



//   useEffect(() => {
//     getRequests();
//   }, []);


//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#F07C00" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
//       <View style={styles.overlay}>
//         <View style={styles.cardContainer}>
//           {/* HEADER */}
//           <View style={styles.header}>
//             <Feather
//               name="arrow-left"
//               size={18}
//               color="#000"
//               onPress={() => navigation.goBack()}
//             />
//             <Text style={styles.headerTitle}>Request Status</Text>
//           </View>

//           <Divider />


//           <FlatList
//             data={data}
//             keyExtractor={(item, index) => index.toString()}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 20 }}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No request Found</Text>
//             }
//             renderItem={({ item }) => (
//               <View style={styles.statusCard}>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>Request No</Text>
//                   <Text style={styles.value}>- {item.request_no}</Text>
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Service Name</Text>
//                   <Text style={styles.value}>- {item.title}</Text>
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>Date</Text>
//                   <Text style={styles.value}>- {item.post_date}</Text>
//                 </View>
//                 <View style={styles.bottomRow}>
//                   <View style={styles.stars}>
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <Feather
//                         key={i}
//                         name="star"
//                         size={15}
//                         color={i <= Number(item.ratting) ? "#F07C00" : "#D9D9D9"}
//                       />
//                     ))}
//                   </View>

//                   <TouchableOpacity
//                     style={[
//                       styles.btn,
//                       item.request_status === "0" && styles.btnDisabled,
//                     ]}
//                     disabled={item.request_status === "0"}
//                     onPress={() =>
//                       item.request_status !== "0" &&
//                       navigation.navigate("RateService", {
//                         requestId: item.request_no,
//                       })
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.btnText,
//                         item.request_status === "0" && styles.btnTextDisabled,
//                       ]}
//                     >
//                       {item.request_status === "0" ? "Pending" : "Completed"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//               </View>
//             )}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";  
import Feather from "react-native-vector-icons/Feather"; 
import { useNavigation } from "@react-navigation/native"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import axios from "axios";

export default function ServiceStatus() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRequests = async () => {
    try {
      setLoading(true);

    
      const uniqueid = await AsyncStorage.getItem("unique_id");
      console.log("UNIQUE ID SENT:", uniqueid);

      const body = new URLSearchParams();
      body.append("uniqueid", uniqueid);

      const res = await axios.post(
        "https://patilhardware.com/MobileWeb/userPreviousRequests",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("API RESPONSE:", res.data);

      setData(Array.isArray(res.data?.post) ? res.data.post : []);
    } catch (e) {
      console.log("API ERROR:", e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F07C00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Feather
            name="arrow-left"
            size={18}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Request Status</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.request_no.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Request Found</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.statusCard}>
              <Text>Request No - {item.request_no}</Text>
              <Text>Service Name - {item.title}</Text>
              <Text>Date - {item.post_date}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Feather
                      key={i}
                      name="star"
                      size={14}
                      color={
                        i <= Number(item.ratting)
                          ? "#F07C00"
                          : "#D9D9D9"
                      }
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.btn}
                  disabled={item.requst_status === "0"}
                >
                  <Text style={styles.btnText}>
                    {item.requst_status === "0"
                      ? "Pending"
                      : "Completed"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontSize: 13,
    color: "#555",
  },
  value: {
    fontSize: 13,
    color: "#000",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 6,
  },
  btn: {
    backgroundColor: "#F07C00",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnDisabled: {
    backgroundColor: "#E0E0E0",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  btnTextDisabled: {
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});