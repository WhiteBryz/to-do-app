import ChipFilter from "@/components/ChipFilter";
import { useTasks } from "@/hooks/UseTasks";
import {
  getMonthlyProgress,
  getMostProductiveDay,
  getProductivity,
  getWeeklyProgress,
} from "@/utils/chartHelpers";
import { isThisMonth, isThisWeek, parseISO } from "date-fns";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./styles";

// Opciones de filtro para las gráficas
const graphicFilters = [
  { label: "Semanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
  { label: "Productividad", value: "productivity" },
];

export default function Charts() {
  const [filter, setFilter] = useState<
    "weekly" | "monthly" | "productivity" | null
  >("weekly");
  const { tasks } = useTasks();

  let progress = 0;
  let label = "";

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
          tintColor="#00e0ff"
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
        Tienes un progreso del {Math.floor(progress / tasks.length)}%
      </Text>
      <Text style={{ fontSize: 16, marginTop: 20, alignSelf: "center" }}>
        {filter === "productivity"
          ? `Tu dia mas productivo fue el ${DiaMasproductivo}`
          : `Has completado ${progress} de ${
              filter === "weekly"
                ? tasks.filter((t) =>
                    isThisWeek(parseISO(t.date), { weekStartsOn: 1 })
                  ).length
                : tasks.filter((t) => isThisMonth(parseISO(t.date))).length
            } tus tareas ${
              filter === "weekly"
                ? "semanales"
                : filter === "monthly"
                ? "mensuales"
                : ""
            }`}
      </Text>

      {pendingTasks.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          No tienes tareas pendientes{" "}
        </Text>
      ) : (
        pendingTasks.map((task) => (
          <ScrollView
            key={task.id}
            style={{
              marginVertical: 5,
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
          </ScrollView>
        ))
      )}
    </View>
  );
}
