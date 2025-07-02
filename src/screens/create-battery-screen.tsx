import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip,
  Divider,
  HelperText,
  ProgressBar,
  FAB,
  IconButton,
  Surface
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { database } from '../database/database';
import { colors } from '../theme/theme';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 600;

const CreateBatteryScreen: React.FC = () => {
  const [batteryName, setBatteryName] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [wordError, setWordError] = useState('');
  const [showWordsList, setShowWordsList] = useState(false);

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
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving battery:', error);
      Alert.alert('Error', 'No se pudo guardar la batería');
    } finally {
      setLoading(false);
    }
  };

  const getProgressValue = () => {
    const maxRecommended = 50;
    return Math.min(words.length / maxRecommended, 1);
  };

  const getProgressColor = () => {
    if (words.length < 10) return colors.error;
    if (words.length < 30) return colors.warning;
    return colors.success;
  };

  const getStatusInfo = () => {
    if (words.length === 0) return { text: 'Comienza agregando palabras', icon: 'plus-circle-outline' };
    if (words.length < 10) return { text: 'Necesitas más palabras', icon: 'alert-circle-outline' };
    if (words.length < 30) return { text: 'Buen progreso', icon: 'check-circle-outline' };
    return { text: '¡Excelente batería!', icon: 'star-circle' };
  };

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundView}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crear Nueva Batería</Text>
            <Text style={styles.headerSubtitle}>
              Crea tu propia colección de palabras para jugar
            </Text>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Progress Card */}
            <Surface style={styles.progressCard} elevation={3}>
              <View style={styles.progressHeader}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressTitle}>Progreso de la Batería</Text>
                  <View style={styles.statusContainer}>
                    <IconButton 
                      icon={statusInfo.icon} 
                      size={24} 
                      iconColor={getProgressColor()}
                      style={styles.statusIcon}
                    />
                    <Text style={[styles.statusText, { color: getProgressColor() }]}>
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>
                <View style={styles.wordsCount}>
                  <Text style={styles.wordsCountNumber}>{words.length}</Text>
                  <Text style={styles.wordsCountLabel}>palabras</Text>
                </View>
              </View>
              <ProgressBar 
                progress={getProgressValue()} 
                color={getProgressColor()}
                style={styles.progressBar}
              />
              <Text style={styles.progressHelp}>
                Recomendado: 30-50 palabras para la mejor experiencia
              </Text>
            </Surface>

            {/* Battery Name Section */}
            <Surface style={styles.inputCard} elevation={2}>
              <Text style={styles.cardTitle}>Nombre de la Batería</Text>
              <TextInput
                label="Ej: Animales, Deportes, Comida..."
                value={batteryName}
                onChangeText={(text) => {
                  setBatteryName(text);
                  validateBatteryName(text);
                }}
                mode="outlined"
                style={styles.nameInput}
                error={!!nameError}
                maxLength={50}
                left={<TextInput.Icon icon="battery" />}
              />
              <HelperText type="error" visible={!!nameError}>
                {nameError}
              </HelperText>
            </Surface>

            {/* Add Words Section */}
            <Surface style={styles.inputCard} elevation={2}>
              <Text style={styles.cardTitle}>Agregar Palabras</Text>
              <View style={styles.addWordContainer}>
                <TextInput
                  label="Escribe una palabra"
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
                  left={<TextInput.Icon icon="pencil" />}
                />
                <FAB
                  icon="plus"
                  size="small"
                  onPress={handleAddWord}
                  style={[styles.addFAB, { backgroundColor: colors.success }]}
                  disabled={!currentWord.trim()}
                />
              </View>
              <HelperText type="error" visible={!!wordError}>
                {wordError}
              </HelperText>
            </Surface>

            {/* Recent Words Preview */}
            {words.length > 0 && (
              <Surface style={styles.previewCard} elevation={2}>
                <View style={styles.previewHeader}>
                  <Text style={styles.cardTitle}>Últimas palabras agregadas</Text>
                  <Button
                    mode="text"
                    onPress={() => setShowWordsList(!showWordsList)}
                    compact
                  >
                    {showWordsList ? 'Ocultar' : `Ver todas (${words.length})`}
                  </Button>
                </View>
                <View style={styles.previewWordsContainer}>
                  {words.slice(-6).reverse().map((word, index) => (
                    <Chip 
                      key={`preview-${index}`}
                      style={styles.previewWordChip}
                      textStyle={styles.previewWordText}
                    >
                      {word}
                    </Chip>
                  ))}
                </View>
              </Surface>
            )}

            {/* Full Words List */}
            {showWordsList && words.length > 0 && (
              <Surface style={styles.wordsListCard} elevation={2}>
                <View style={styles.wordsListHeader}>
                  <Text style={styles.cardTitle}>Todas las palabras ({words.length})</Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => setShowWordsList(false)}
                  />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.wordsContainer}>
                  {words.map((word, index) => (
                    <Chip 
                      key={index}
                      style={styles.wordChip}
                      onClose={() => handleRemoveWord(index)}
                      closeIcon="delete"
                    >
                      {word}
                    </Chip>
                  ))}
                </View>
              </Surface>
            )}
          </ScrollView>

          {/* Fixed Save Button */}
          <View style={styles.saveButtonContainer}>
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
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    maxWidth: isTablet ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    margin: 0,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  wordsCount: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 70,
  },
  wordsCountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  wordsCountLabel: {
    fontSize: 12,
    color: colors.textLight,
    opacity: 0.9,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressHelp: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  nameInput: {
    backgroundColor: 'transparent',
  },
  addWordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  wordInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  addFAB: {
    marginTop: 8,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewWordChip: {
    backgroundColor: colors.tertiary,
  },
  previewWordText: {
    color: colors.textLight,
    fontWeight: '500',
  },
  wordsListCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  wordsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    backgroundColor: colors.primary,
    marginBottom: 4,
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    opacity: 0.8,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: colors.success,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonContent: {
    height: 50,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
  },
});

export default CreateBatteryScreen; 