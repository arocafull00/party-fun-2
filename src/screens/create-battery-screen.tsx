import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip,
  Divider,
  HelperText
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { database } from '../database/database';
import { colors } from '../theme/theme';

type RootStackParamList = {
  Home: undefined;
  CreateBattery: undefined;
};

type CreateBatteryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateBattery'>;

const CreateBatteryScreen: React.FC = () => {
  const navigation = useNavigation<CreateBatteryScreenNavigationProp>();
  const [batteryName, setBatteryName] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [wordError, setWordError] = useState('');

  const validateBatteryName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('El nombre de la batería es obligatorio');
      return false;
    }
    if (name.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateWord = (word: string): boolean => {
    if (!word.trim()) {
      setWordError('La palabra no puede estar vacía');
      return false;
    }
    if (word.trim().length < 2) {
      setWordError('La palabra debe tener al menos 2 caracteres');
      return false;
    }
    if (words.includes(word.trim().toLowerCase())) {
      setWordError('Esta palabra ya existe en la lista');
      return false;
    }
    setWordError('');
    return true;
  };

  const handleAddWord = () => {
    const trimmedWord = currentWord.trim();
    
    if (!validateWord(trimmedWord)) {
      return;
    }

    setWords([...words, trimmedWord]);
    setCurrentWord('');
    setWordError('');
  };

  const handleRemoveWord = (index: number) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleSaveBattery = async () => {
    if (!validateBatteryName(batteryName)) {
      return;
    }

    if (words.length === 0) {
      Alert.alert('Sin palabras', 'Debes agregar al menos una palabra a la batería');
      return;
    }

    if (words.length < 10) {
      Alert.alert(
        'Pocas palabras',
        `Solo tienes ${words.length} palabras. Se recomienda tener al menos 30 palabras para una mejor experiencia de juego. ¿Quieres continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar', onPress: saveBattery },
        ]
      );
      return;
    }

    saveBattery();
  };

  const saveBattery = async () => {
    setLoading(true);
    try {
      const batteryId = await database.createBateria(batteryName.trim());
      
      // Add all words to the battery
      for (const word of words) {
        await database.addPalabra(batteryId, word);
      }

      Alert.alert(
        'Batería creada',
        `Se ha creado la batería "${batteryName}" con ${words.length} palabras`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving battery:', error);
      Alert.alert('Error', 'No se pudo guardar la batería');
    } finally {
      setLoading(false);
    }
  };

  const getWordsCountColor = () => {
    if (words.length < 10) return colors.error;
    if (words.length < 30) return colors.warning;
    return colors.success;
  };

  const getWordsCountText = () => {
    if (words.length < 10) return 'Muy pocas palabras';
    if (words.length < 30) return 'Palabras suficientes';
    return 'Excelente cantidad';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Battery Name Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Nombre de la Batería</Text>
              <TextInput
                label="Nombre de la batería"
                value={batteryName}
                onChangeText={(text) => {
                  setBatteryName(text);
                  validateBatteryName(text);
                }}
                mode="outlined"
                style={styles.input}
                error={!!nameError}
                maxLength={50}
              />
              <HelperText type="error" visible={!!nameError}>
                {nameError}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Add Words Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Agregar Palabras</Text>
              <View style={styles.addWordContainer}>
                <TextInput
                  label="Nueva palabra"
                  value={currentWord}
                  onChangeText={(text) => {
                    setCurrentWord(text);
                    if (wordError) setWordError('');
                  }}
                  mode="outlined"
                  style={styles.wordInput}
                  error={!!wordError}
                  maxLength={30}
                  onSubmitEditing={handleAddWord}
                  returnKeyType="done"
                />
                <Button
                  mode="contained"
                  onPress={handleAddWord}
                  style={styles.addButton}
                  contentStyle={styles.addButtonContent}
                  disabled={!currentWord.trim()}
                >
                  +
                </Button>
              </View>
              <HelperText type="error" visible={!!wordError}>
                {wordError}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Words Count */}
          <Card style={styles.card}>
            <Card.Content style={styles.countContainer}>
              <Text style={styles.countText}>
                Palabras agregadas: {words.length}
              </Text>
              <Chip 
                icon="cards" 
                style={[styles.countChip, { backgroundColor: getWordsCountColor() }]}
                textStyle={{ color: colors.textLight }}
              >
                {getWordsCountText()}
              </Chip>
            </Card.Content>
          </Card>

          {/* Words List */}
          {words.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Lista de Palabras</Text>
                <Divider style={styles.divider} />
                <View style={styles.wordsContainer}>
                  {words.map((word, index) => (
                    <View key={index} style={styles.wordItem}>
                      <Chip 
                        style={styles.wordChip}
                        onClose={() => handleRemoveWord(index)}
                      >
                        {word}
                      </Chip>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSaveBattery}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            labelStyle={styles.saveButtonLabel}
            loading={loading}
            disabled={loading || !batteryName.trim() || words.length === 0}
            icon="content-save"
          >
            GUARDAR BATERÍA
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  card: {
    marginBottom: 15,
    backgroundColor: colors.surface,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
  },
  addWordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  wordInput: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  addButton: {
    backgroundColor: colors.success,
    minWidth: 50,
  },
  addButtonContent: {
    height: 56,
    justifyContent: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  countChip: {
    elevation: 2,
  },
  divider: {
    backgroundColor: '#CCCCCC',
    marginBottom: 15,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordItem: {
    marginBottom: 5,
  },
  wordChip: {
    backgroundColor: colors.primary,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: colors.success,
    marginBottom: 15,
  },
  saveButtonContent: {
    height: 50,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  helperCard: {
    backgroundColor: colors.tertiary,
    marginBottom: 20,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  helperText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default CreateBatteryScreen; 