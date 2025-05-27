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
import { format, isThisMonth, isThisWeek, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ScrollView } from "react-native-gesture-handler";

// Opciones de filtro para las gráficas
const graphicFilters = [
  { label: "Semanal", value: "weekly" },
  { label: "Productividad", value: "productivity" },
  { label: "Mensual", value: "monthly" },
];

// Función helper para validar y parsear fechas
const safeParseDateString = (dateString:string) => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    return null;
  }
};

export default function Charts() {
  const theme = useTheme();
  const [filter, setFilter] = useState("weekly");
  const { tasks } = useTasks();
  const layout = useWindowDimensions();

  // Validar que tasks existe y es un array
  const safeTasks = useMemo(() => {
    return Array.isArray(tasks) ? tasks : [];
  }, [tasks]);

  // Calcular progreso
  const { progress, label } = useMemo(() => {
    let calculatedProgress = 0;
    let calculatedLabel = "";

    if (filter === "weekly") {
      calculatedProgress = getWeeklyProgress(safeTasks);
      calculatedLabel = "Avance semanal";
    } else if (filter === "monthly") {
      calculatedProgress = getMonthlyProgress(safeTasks);
      calculatedLabel = "Avance mensual";
    } else if (filter === "productivity") {
      calculatedProgress = getProductivity(safeTasks);
      calculatedLabel = "Productividad";
    }

    return { progress: calculatedProgress, label: calculatedLabel };
  }, [filter, safeTasks]);

  // Obtener día más productivo (solo para productividad)
  const formattedProductiveDay = useMemo(() => {
    if (filter !== "productivity") return "";
    
    const mostProductiveDay = getMostProductiveDay(safeTasks);
    
    if (!mostProductiveDay) {
      return "";
    }

    try {
      const dateObj = new Date(mostProductiveDay);
      if (isNaN(dateObj.getTime())) {
        return "";
      }
      return format(dateObj, "EEEE d 'de' MMMM", { locale: es });
    } catch (error) {
      return "";
    }
  }, [safeTasks, filter]);

  // Filtrar tareas pendientes (solo para semanal y mensual)
  const pendingTasks = useMemo(() => {
    if (filter === "productivity") {
      return [];
    }

    return safeTasks.filter((task) => {
      if (!task || !task.date || task.completed) {
        return false;
      }

      const taskDate = safeParseDateString(task.date);
      if (!taskDate) {
        return false;
      }

      try {
        if (filter === "weekly") {
          return isThisWeek(taskDate, { weekStartsOn: 1 });
        } else if (filter === "monthly") {
          return isThisMonth(taskDate);
        }
        return false;
      } catch (error) {
        return false;
      }
    });
  }, [safeTasks, filter]);

  // Obtener productividad por día (solo para productividad)
  const productivityByDay = useMemo(() => {
    if (filter !== "productivity") return {};
    return getProductivityPerDay(safeTasks);
  }, [safeTasks, filter]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Chips de filtro */}
      <View style={[styles.chipContainer, { marginBottom: 8 }]}>
        {graphicFilters.map((f) => (
          <ChipFilterAlternative
            key={f.value}
            label={f.label}
            selected={filter === f.value}
            onSelect={() => setFilter(f.value)}
            selectedBackground={theme.chipSelected}
            selectedTextColor={theme.chipText}
            unselectedBackground={theme.chipUnselectedBackground}
            unselectedTextColor={theme.chipUnselectedText}
          />
        ))}
      </View>

      {/* Círculo de progreso */}
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
            <Text
              style={[styles.percentageText, { color: theme.progressText }]}
            >
              {Math.round(fill || 0)}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Contenido específico según el filtro */}
      <ScrollView
        style={{ flex: 1, marginTop: 20 }}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* PANTALLA PRODUCTIVIDAD: Solo tareas por día */}
        {filter === "productivity" && (
          <>
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
            
            {Object.entries(productivityByDay).map(([day, data]) => {
              // Type assertion for data
              const { completed, total } = data as { completed: number; total: number };
              return (
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
                    completed={completed} 
                    total={total} 
                  />
                </View>
              );
            })}
            
            {Object.keys(productivityByDay).length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: theme.text,
                  marginTop: 50,
                }}
              >
                No hay datos de productividad disponibles
              </Text>
            )}
          </>
        )}

        {/* PANTALLAS SEMANAL/MENSUAL: Solo tareas pendientes */}
        {(filter === "weekly" || filter === "monthly") && (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.text,
                marginBottom: 16,
                paddingHorizontal: 16,
              }}
            >
              Tareas Pendientes
            </Text>
            
            {pendingTasks.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.text,
                  marginTop: 50,
                }}
              >
                No tienes tareas pendientes
              </Text>
            ) : (
              <>
                {pendingTasks.map((task) => {
                  if (!task || !task.id || !task.title) {
                    return null;
                  }

                  return (
                    <View
                      key={task.id}
                      style={{
                        marginVertical: 5,
                        marginHorizontal: 16,
                        padding: 12,
                        backgroundColor: theme.taskCardBackground,
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: theme.primary,
                      }}
                    >
                      <Text
                        style={{ 
                          fontSize: 16, 
                          fontWeight: "600", 
                          color: theme.text,
                          marginBottom: 4,
                        }}
                      >
                        {task.title}
                      </Text>
                      <Text style={{ fontSize: 14, color: theme.dateText }}>
                        {task.date ? task.date.split("T")[0] : "Sin fecha"} - {task.time || "Sin hora"}
                      </Text>
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 16,
    gap: 8,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  labelText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});