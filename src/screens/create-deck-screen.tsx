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

const CreateDeckScreen: React.FC = () => {
  const [deckName, setDeckName] = useState('');
  const [currentCard, setCurrentCard] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [cardError, setCardError] = useState('');
  const [showCardsList, setShowCardsList] = useState(false);

  const validateDeckName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('El nombre del mazo es obligatorio');
      return false;
    }
    if (name.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateCard = (card: string): boolean => {
    if (!card.trim()) {
      setCardError('La carta no puede estar vacía');
      return false;
    }
    if (card.trim().length < 2) {
      setCardError('La carta debe tener al menos 2 caracteres');
      return false;
    }
    if (cards.includes(card.trim().toLowerCase())) {
      setCardError('Esta carta ya existe en la lista');
      return false;
    }
    setCardError('');
    return true;
  };

  const handleAddCard = () => {
    const trimmedCard = currentCard.trim();
    
    if (!validateCard(trimmedCard)) {
      return;
    }

    setCards([...cards, trimmedCard]);
    setCurrentCard('');
    setCardError('');
  };

  const handleRemoveCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const handleSaveDeck = async () => {
    if (!validateDeckName(deckName)) {
      return;
    }

    if (cards.length === 0) {
      Alert.alert('Sin cartas', 'Debes agregar al menos una carta al mazo');
      return;
    }

    if (cards.length < 10) {
      Alert.alert(
        'Pocas cartas',
        `Solo tienes ${cards.length} cartas. Se recomienda tener al menos 30 cartas para una mejor experiencia de juego. ¿Quieres continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar', onPress: saveDeck },
        ]
      );
      return;
    }

    saveDeck();
  };

  const saveDeck = async () => {
    setLoading(true);
    try {
      const deckId = await database.createMazo(deckName.trim());
      
      // Add all cards to the deck
      for (const card of cards) {
        await database.addCarta(deckId, card);
      }

      Alert.alert(
        'Mazo creado',
        `Se ha creado el mazo "${deckName}" con ${cards.length} cartas`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving deck:', error);
      Alert.alert('Error', 'No se pudo guardar el mazo');
    } finally {
      setLoading(false);
    }
  };

  const getProgressValue = () => {
    const maxRecommended = 50;
    return Math.min(cards.length / maxRecommended, 1);
  };

  const getProgressColor = () => {
    if (cards.length < 10) return colors.error;
    if (cards.length < 30) return colors.warning;
    return colors.success;
  };

  const getStatusInfo = () => {
    if (cards.length === 0) return { text: 'Comienza agregando cartas', icon: 'plus-circle-outline' };
    if (cards.length < 10) return { text: 'Necesitas más cartas', icon: 'alert-circle-outline' };
    if (cards.length < 30) return { text: 'Buen progreso', icon: 'check-circle-outline' };
    return { text: '¡Excelente mazo!', icon: 'star-circle' };
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
            <Text style={styles.headerTitle}>Crear Nuevo Mazo</Text>
            <Text style={styles.headerSubtitle}>
              Crea tu propia colección de cartas para jugar
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
                  <Text style={styles.progressTitle}>Progreso del Mazo</Text>
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
                <View style={styles.cardsCount}>
                  <Text style={styles.cardsCountNumber}>{cards.length}</Text>
                  <Text style={styles.cardsCountLabel}>cartas</Text>
                </View>
              </View>
              <ProgressBar 
                progress={getProgressValue()} 
                color={getProgressColor()}
                style={styles.progressBar}
              />
              <Text style={styles.progressHelp}>
                Recomendado: 30-50 cartas para la mejor experiencia
              </Text>
            </Surface>

            {/* Deck Name Section */}
            <Surface style={styles.inputCard} elevation={2}>
              <Text style={styles.cardTitle}>Nombre del Mazo</Text>
              <TextInput
                label="Ej: Animales, Deportes, Comida..."
                value={deckName}
                onChangeText={(text) => {
                  setDeckName(text);
                  validateDeckName(text);
                }}
                mode="outlined"
                style={styles.nameInput}
                error={!!nameError}
                maxLength={50}
                left={<TextInput.Icon icon="cards" />}
              />
              <HelperText type="error" visible={!!nameError}>
                {nameError}
              </HelperText>
            </Surface>

            {/* Add Cards Section */}
            <Surface style={styles.inputCard} elevation={2}>
              <Text style={styles.cardTitle}>Agregar Cartas</Text>
              <View style={styles.addCardContainer}>
                <TextInput
                  label="Escribe una carta"
                  value={currentCard}
                  onChangeText={(text) => {
                    setCurrentCard(text);
                    if (cardError) setCardError('');
                  }}
                  mode="outlined"
                  style={styles.cardInput}
                  error={!!cardError}
                  maxLength={30}
                  onSubmitEditing={handleAddCard}
                  returnKeyType="done"
                  left={<TextInput.Icon icon="pencil" />}
                />
                <FAB
                  icon="plus"
                  size="small"
                  onPress={handleAddCard}
                  style={[styles.addFAB, { backgroundColor: colors.success }]}
                  disabled={!currentCard.trim()}
                />
              </View>
              <HelperText type="error" visible={!!cardError}>
                {cardError}
              </HelperText>
            </Surface>

            {/* Recent Cards Preview */}
            {cards.length > 0 && (
              <Surface style={styles.previewCard} elevation={2}>
                <View style={styles.previewHeader}>
                  <Text style={styles.cardTitle}>Últimas cartas agregadas</Text>
                  <Button
                    mode="text"
                    onPress={() => setShowCardsList(!showCardsList)}
                    compact
                  >
                    {showCardsList ? 'Ocultar' : `Ver todas (${cards.length})`}
                  </Button>
                </View>
                <View style={styles.previewCardsContainer}>
                  {cards.slice(-6).reverse().map((card, index) => (
                    <Chip 
                      key={`preview-${index}`}
                      style={styles.previewCardChip}
                      textStyle={styles.previewCardText}
                    >
                      {card}
                    </Chip>
                  ))}
                </View>
              </Surface>
            )}

            {/* Full Cards List */}
            {showCardsList && cards.length > 0 && (
              <Surface style={styles.cardsListCard} elevation={2}>
                <View style={styles.cardsListHeader}>
                  <Text style={styles.cardTitle}>Todas las cartas ({cards.length})</Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => setShowCardsList(false)}
                  />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.cardsContainer}>
                  {cards.map((card, index) => (
                    <Chip 
                      key={index}
                      style={styles.cardChip}
                      onClose={() => handleRemoveCard(index)}
                      closeIcon="delete"
                    >
                      {card}
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
              onPress={handleSaveDeck}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              loading={loading}
              disabled={loading || !deckName.trim() || cards.length === 0}
              icon="content-save"
            >
              GUARDAR MAZO
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
  cardsCount: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 70,
  },
  cardsCountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  cardsCountLabel: {
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
  addCardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardInput: {
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
  previewCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewCardChip: {
    backgroundColor: colors.tertiary,
  },
  previewCardText: {
    color: colors.textLight,
    fontWeight: '500',
  },
  cardsListCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardChip: {
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

export default CreateDeckScreen; 