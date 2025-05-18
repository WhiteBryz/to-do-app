import ChipFilter from "@/components/ChipFilter";
import { useTasks } from "@/hooks/UseTasks";
import {
  getMonthlyProgress,
  getMostProductiveDay,
  getProductivity,
  getWeeklyProgress,
  getProductivityPerDay,
} from "@/utils/chartHelpers";
import { format, isThisMonth, isThisWeek, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./styles";
import ProgressBarComponent from "@/components/ProgressBar";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";

// Opciones de filtro para las gráficas
const graphicFilters = [
  { label: "Semanal", value: "weekly" },
  { label: "Productividad", value: "productivity" },
  { label: "Mensual", value: "monthly" },
];
// OPciones de filtro para las gráficas
export default function Charts() {
  const [filter, setFilter] = useState<
    "weekly" | "productivity" | "monthly" | null
  >("weekly");
  const { tasks } = useTasks();

  let progress = 0;
  let label = "";
  // Definición de la variable de progreso y su etiqueta
  if (filter === "weekly") {
    progress = getWeeklyProgress(tasks);
    label = "Avance semanal";
  } else if (filter === "monthly") {
    progress = getMonthlyProgress(tasks);
    label = "Avance mensual";
  } else if (filter === "productivity") {
    progress = getProductivity(tasks);
    label = "Productividad";
  }

  let DiaMasproductivo = getMostProductiveDay(tasks);
  let formattedProductiveDay = "";

  if (DiaMasproductivo && typeof DiaMasproductivo === "string") {
    // Convertir string a Date y formatear en español
    const dateObj = new Date(DiaMasproductivo);
    if (!isNaN(dateObj.getTime())) {
      formattedProductiveDay = format(dateObj, "EEEE d 'de' MMMM", {
        locale: es,
      });
    }
  }
  // Filtrar tareas pendientes según el filtro seleccionado
  const pendingTasks =
    filter === "weekly"
      ? tasks.filter(
          (t) =>
            !t.completed && isThisWeek(parseISO(t.date), { weekStartsOn: 1 })
        )
      : filter === "monthly"
      ? tasks.filter((t) => !t.completed && isThisMonth(parseISO(t.date)))
      : filter === "productivity"
      ? []
      : [];
  const filteredTasks =
    filter === "weekly"
      ? tasks.filter((t) => isThisWeek(parseISO(t.date), { weekStartsOn: 1 }))
      : filter === "monthly"
      ? tasks.filter((t) => isThisMonth(parseISO(t.date)))
      : [];

  const completedTasks = filteredTasks.filter((t) => t.completed).length;
  const totalTasks = filteredTasks.length;
  const productivityByDay = getProductivityPerDay(tasks);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "productivity", title: "Productividad por día" },
    { key: "pending", title: "Actividades pendientes" },
  ]);
  // Escena: Productividad por día
  const ProductivityRoute = () => (
    <ScrollView
      style={{ marginTop: 10 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {formattedProductiveDay && (
        <Text
          style={{
            fontSize: 16,
            alignSelf: "center",
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          Tu día más productivo fue el {formattedProductiveDay}
        </Text>
      )}
      {Object.entries(productivityByDay).map(([day, data]) => (
        <View key={day} style={{ marginBottom: 20, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 8,
              textTransform: "capitalize",
              fontSize: 16,
            }}
          >
            {day}
          </Text>
          <ProgressBarComponent completed={data.completed} total={data.total} />
        </View>
      ))}
    </ScrollView>
  );

  // Escena: Actividades pendientes
  const PendingRoute = () => (
    <ScrollView style={{ marginTop: 10 }}>
      {pendingTasks.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          No tienes tareas pendientes
        </Text>
      ) : (
        <>
          {pendingTasks.map((task) => (
            <View
              key={task.id}
              style={{
                marginVertical: 5,
                marginHorizontal: 16,
                padding: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {task.title}
              </Text>
              <Text style={{ fontSize: 14, color: "#666" }}>
                {task.date.split("T")[0]} - {task.time}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    productivity: ProductivityRoute,
    pending: PendingRoute,
  });

  return (
    <View style={styles.container}>
      {/* Filtros con chips */}
      <View style={styles.chipContainer}>
        {graphicFilters.map((f) => (
          <ChipFilter
            key={f.value}
            label={f.label}
            selected={filter === f.value}
            onSelect={() =>
              setFilter(f.value as "weekly" | "monthly" | "productivity")
            } // toggle
          />
        ))}
      </View>

      {/* Visualización del progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.labelText}>{label}</Text>
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={progress}
          tintColor="#6850A6"
          backgroundColor="#3d5875"
          lineCap="round"
          rotation={180}
        >
          {(fill) => (
            <Text style={styles.percentageText}>{Math.round(fill)}%</Text>
          )}
        </AnimatedCircularProgress>

        {/*Texto*/}
      </View>
      <Text style={{ fontSize: 16, marginTop: 20, alignSelf: "center" }}>
        {filter === "productivity" && (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props: []) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "#6850A6" }}
                style={{ backgroundColor: "#f5f5f5" }}
                activeColor="#6850A6"
                inactiveColor="#999"
                labelStyle={{ fontSize: 14, fontWeight: "bold" }}
              />
            )}
          />
        )}
      </Text>
    </View>
  );
}
