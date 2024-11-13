import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

// Define the prop types for the CustomTextInput component
interface CustomTextInputProps {
  value: string; // value should be a string
  onChange: (text: string) => void; // onChange should be a function that accepts a string
  placeholder: string; // placeholder should be a string
  secureTextEntry: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChange,
  placeholder,
  secureTextEntry,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (text: string) => {
    setInputValue(text); // Update the internal state
    onChange(text); // Propagate the change to the parent
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={inputValue}
      onChangeText={handleChange}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 258,
    height: 40,
    borderRadius: 40,
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: "transparent",
    color: "white",
    padding: 10,
  },
});

export default CustomTextInput;
