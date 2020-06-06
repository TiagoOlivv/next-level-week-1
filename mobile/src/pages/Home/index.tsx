import React, { useEffect, useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, StyleSheet, Text, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import Axios from "axios";

interface UfsData {
  id: number;
  sigla: string;
  nome: string;
}

interface CitiesData {
  id: number;
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<UfsData[]>([]);
  const [cities, setCities] = useState<CitiesData[]>([]);
  const [ufSelected, setUfSelected] = useState("0");
  const [citySelected, setCitySelected] = useState("0");

  useEffect(() => {
    Axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    ).then((response) => {
      setUfs(response.data);
    });
  }, []);

  useEffect(() => {
    if (ufSelected === "0") {
      return;
    }
    Axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`
    ).then((response) => {
      setCities(response.data);
    });
  }, [ufSelected]);

  const placeholderUF = {
    label: "Selecione um Estado",
    value: "0",
    color: "#322153",
  };

  const placeholderCity = {
    label: "Selecione uma Cidade",
    value: "0",
    color: "#322153",
  };

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      city: citySelected,
      uf: ufSelected,
    });
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a econtrarem pontos de coleta de forma eficiente
        </Text>

        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={placeholderUF}
          onValueChange={(value) => setUfSelected(value)}
          items={ufs.map((uf) => ({
            label: `${uf.nome} (${uf.sigla})`,
            value: uf.sigla,
          }))}
        />

        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={placeholderCity}
          onValueChange={(value) => setCitySelected(value)}
          items={cities.map((city) => ({
            label: city.nome,
            value: city.nome,
          }))}
        />
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
    marginBottom: 50,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
