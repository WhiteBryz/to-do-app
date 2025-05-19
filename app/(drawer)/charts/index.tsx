import ChipFilterAlternative from "@/components/ChipFilter2";
import ProgressBarComponent from "@/components/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import { useTasks } from "@/hooks/UseTasks";
import {
  getMonthlyProgress,
  getMostProductiveDay,
  getProductivity,
  getProductivityPerDay,
  getWeeklyProgress,
} from "@/utils/chartHelpers";
import { format, isThisMonth, isThisWeek, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React, { useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ScrollView } from "react-native-gesture-handler";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
// Opciones de filtro para las gráficas
const graphicFilters = [
  { label: "Semanal", value: "weekly" },
  { label: "Productividad", value: "productivity" },
  { label: "Mensual", value: "monthly" },
];
// OPciones de filtro para las gráficas
export default function Charts() {
  const theme = useTheme();
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
      contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {formattedProductiveDay && (
        <Text
          style={{
            fontSize: 16,
            alignSelf: "center",
            marginBottom: 20,
            fontWeight: "bold",
            color: theme.text,
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
              color: theme.text,
            }}
          >
            {day}
          </Text>
          <ProgressBarComponent
            completed={data.completed}
            total={data.total}
          />
        </View>
      ))}
    </ScrollView>
  );

  // Escena: Actividades pendientes
  const PendingRoute = () => (
    <ScrollView
      style={{ marginTop: 10 }}
      contentContainerStyle={{ paddingBottom: 500 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {pendingTasks.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: theme.text,
          }}
        >
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
                backgroundColor: theme.taskCardBackground,
                borderRadius: 8,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: theme.text }}
              >
                {task.title}
              </Text>
              <Text style={{ fontSize: 14, color: theme.dateText }}>
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.chipContainer, { marginBottom: 8 }]}>
        {graphicFilters.map((f) => (
          <ChipFilterAlternative
            key={f.value}
            label={f.label}
            selected={filter === f.value}
            onSelect={() => setFilter(f.value as "weekly" | "monthly" | "productivity")}
            selectedBackground={theme.chipSelected}
            selectedTextColor={theme.chipText}
            unselectedBackground={theme.chipUnselectedBackground}
            unselectedTextColor={theme.chipUnselectedText}
          />
        ))}
      </View>

      <View style={[styles.progressContainer, { marginTop: 0 }]}>
        <Text style={[styles.labelText, { color: theme.text }]}>{label}</Text>
        <AnimatedCircularProgress
          size={200}
          width={15}
          fill={progress}
          tintColor={theme.primary}
          backgroundColor={theme.progressBackground}
          lineCap="round"
          rotation={180}
        >
          {(fill: number) => (
            <Text style={[styles.percentageText, { color: theme.progressText }]}>
              {Math.round(fill)}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {filter === "productivity" && (
        <View style={{ flex: 1, marginTop: 20 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: theme.primary }}
                style={{ backgroundColor: theme.background }}
                activeColor={theme.primary}
                inactiveColor={theme.secondaryText}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 16,
    gap: 8, // Espacio entre chips
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  labelText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});