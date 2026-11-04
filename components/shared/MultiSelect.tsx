import { useState } from "react";
import {
  Modal, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  label: string;
  value: string[];
  onChange: (selectedValues: string[]) => void;
}

const MultiSelect = ({
  options,
  label,
  value,
  onChange,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(value || []);

  // Alternar la visibilidad del menú desplegable 
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Manejar el cambio de entrada de búsqueda 
  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  // Manejar la selección de la casilla de verificación 
  const handleOptionSelect = (optionValue: string) => {
    let updatedOptions;
    if (selectedOptions.includes(optionValue)) {
      updatedOptions = selectedOptions.filter((item) => item !== optionValue);
    } else {
      updatedOptions = [...selectedOptions, optionValue];
    }
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions); // Pasar selecciones actualizadas al elemento padre 
  };

  // Filtra las opciones según la consulta de búsqueda 
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectContainer} onPress={toggleDropdown}>
        <Text style={styles.selectedValues}>
          {selectedOptions.length > 0
            ? options
              .filter((o) => selectedOptions.includes(o.value))
              .map((o) => o.label)
              .join(", ")
            : "Seleccionar opciones"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => { }}
          >
            <Text style={styles.modalTitle}>{label}</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={search}
              onChangeText={handleSearchChange}
            />

            <ScrollView
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              {filteredOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => handleOptionSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.includes(item.value) &&
                      styles.selectedOption,
                    ]}
                  >
                    {selectedOptions.includes(item.value)
                      ? "☑ "
                      : "☐ "}
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeButtonText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MultiSelect;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
    elevation: 999,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    zIndex: 1
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 1
  },
  selectedValues: {
    fontSize: 14,
    color: "#555",
  },
  dropdown: {
    position: "absolute",
    top: 80, // ajusta según la altura del selector
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,

    maxHeight: 250,

    zIndex: 9999,
    elevation: 10, // Android

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#007bff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  closeButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});