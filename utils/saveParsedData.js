import * as FileSystem from 'expo-file-system';

const dataDirectory = FileSystem.documentDirectory + 'data/';
const parsedDataFilePath = dataDirectory + 'parsedData.json';

const saveParsedData = async (data) => {
  console.log(data);
  try {
    // Check if the directory exists, if not, create it
    const dirInfo = await FileSystem.getInfoAsync(dataDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dataDirectory, { intermediates: true });
    }

    let existingData = [];
    const fileInfo = await FileSystem.getInfoAsync(parsedDataFilePath);
    if (fileInfo.exists) {
      await FileSystem.writeAsStringAsync(parsedDataFilePath, '[]');
    }

    existingData.push({
      numberOfPlayers: data[0],
      numberOfDecks: data[1],
      sideBets: data[2].trim(),
    });
    console.log('Saving data to file...', existingData);
    await FileSystem.writeAsStringAsync(parsedDataFilePath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error('Error saving parsed data:', error);
  }
};

const readParsedData = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(parsedDataFilePath);
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(parsedDataFilePath);
      console.log(JSON.parse(fileContent));
      return JSON.parse(fileContent);
    }
    return [];
  } catch (error) {
    console.error('Error reading parsed data:', error);
    return [];
  }
};

export { saveParsedData, readParsedData };
