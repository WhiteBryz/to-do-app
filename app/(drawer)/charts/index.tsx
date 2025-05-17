import React, { useState } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { useTasks } from "@/hooks/UseTasks";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import ChipFilter from "@/components/ChipFilter";
import { isThisWeek, isThisMonth, parseISO } from "date-fns";
import { useRouter } from "expo-router";
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

  // Cálculo de porcentajes
  const getWeeklyProgress = () => {
    const weekTasks = tasks.filter((t) =>
      isThisWeek(parseISO(t.date), { weekStartsOn: 1 })
    );
    const completed = weekTasks.filter((t) => t.completed).length;
    return weekTasks.length ? (completed / weekTasks.length) * 100 : 0;
  };

  const getMonthlyProgress = () => {
    const monthTasks = tasks.filter((t) => isThisMonth(parseISO(t.date)));
    const completed = monthTasks.filter((t) => t.completed).length;
    return monthTasks.length ? (completed / monthTasks.length) * 100 : 0;
  };

  // Puedes definir productividad como gustes, aquí un ejemplo simple:
  const getProductivity = () => {
    // Ejemplo: porcentaje de tareas completadas sobre todas las tareas
    const completed = tasks.filter((t) => t.completed).length;
    return tasks.length ? (completed / tasks.length) * 100 : 0;
  };

  let progress = 0;
  let label = "";

  if (filter === "weekly") {
    progress = getWeeklyProgress();
    label = "Avance semanal";
  } else if (filter === "monthly") {
    progress = getMonthlyProgress();
    label = "Avance mensual";
  } else if (filter === "productivity") {
    progress = getProductivity();
    label = "Productividad";
  }

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
      </View>
    </View>
  );
}
