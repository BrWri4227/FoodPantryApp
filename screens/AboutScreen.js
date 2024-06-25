import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CIS4030 Mobile Computing</Text>
      <Text style={styles.subtitle}>Milestone 3</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members:</Text>
        <Text style={styles.members}>Jean-Pierre Mouallem | Luc Dubé | Brycen Wright</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Application:</Text>
        <Text style={styles.description}>
          A tool to assist users in their grocery shopping needs. Consisting of a shopping list tool, a pantry tracker, and a recipe finder that recommends 
          recipes based off of the contents of your pantry and adds missing ingredients to your shopping list.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  members: {
    fontSize: 16,
    color: '#555',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#777',
  },
});

export default About;
