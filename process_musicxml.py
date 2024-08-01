from music21 import converter, midi

def convert_musicxml_to_midi(input_path, output_path):
    try:
        # Load the MusicXML file
        score = converter.parse(input_path)
        
        # Convert to MIDI file
        midi_file = midi.translate.music21ObjectToMidiFile(score)
        midi_file.open(output_path, 'wb')
        midi_file.write()
        midi_file.close()
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python process_musicxml.py <input_musicxml> <output_midi>")
        sys.exit(1)
    
    input_musicxml = sys.argv[1]
    output_midi = sys.argv[2]
    convert_musicxml_to_midi(input_musicxml, output_midi)
