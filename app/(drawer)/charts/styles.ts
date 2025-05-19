import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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