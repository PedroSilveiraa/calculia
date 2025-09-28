import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserStorage } from '../app/database/UserStorage';

export default function FirstTimeSetup({ onComplete }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validações básicas
        if (!name.trim()) {
            Alert.alert('Ops!', 'Por favor, digite o nome da criança');
            return;
        }

        const ageNum = parseInt(age);
        if (!ageNum || ageNum < 3 || ageNum > 12) {
            Alert.alert('Ops!', 'Por favor, digite uma idade válida (3-12 anos)');
            return;
        }

        setLoading(true);

        try {
            const userData = await UserStorage.saveUserData(name.trim(), ageNum);
            console.log('Usuário criado:', userData);
            onComplete(userData);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
            console.error('Erro ao salvar:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Jogo de Matemática! 🎮</Text>
            <Text style={styles.subtitle}>Vamos começar nossa aventura?</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Qual é o seu nome?</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Digite seu nome"
                    maxLength={30}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantos anos você tem?</Text>
                <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Digite sua idade"
                    keyboardType="numeric"
                    maxLength={2}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Salvando...' : 'Começar a Jogar! 🚀'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f8ff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#7f8c8d',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#34495e',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#3498db',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});