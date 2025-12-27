import struct
import json
import sys

def parse_glb(file_path):
    with open(file_path, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF': return
        f.read(8)
        
        while True:
            try:
                chunk_len_bytes = f.read(4)
                if not chunk_len_bytes: break
                chunk_length = struct.unpack('<I', chunk_len_bytes)[0]
                chunk_type = f.read(4)
                
                if chunk_type == b'JSON':
                    json_data = f.read(chunk_length)
                    data = json.loads(json_data)
                    nodes = data.get('nodes', [])
                    meshes = data.get('meshes', [])
                    accessors = data.get('accessors', [])

                    print("\nNode Transformations:")
                    for index, node in enumerate(nodes):
                        name = node.get('name', f"Node {index}")
                        trans = node.get('translation', 'N/A')
                        rot = node.get('rotation', 'N/A')
                        scale = node.get('scale', 'N/A')
                        matrix = node.get('matrix', 'N/A')
                        print(f"  - {name} (Idx: {index})")
                        print(f"    Pos: {trans}, Rot: {rot}, Scale: {scale}")
                        if matrix != 'N/A':
                            print(f"    Matrix: {matrix}")
                    
                    min_bound = [float('inf')] * 3
                    max_bound = [float('-inf')] * 3
                    
                    for mesh in meshes:
                        for prim in mesh['primitives']:
                            attrs = prim['attributes']
                            if 'POSITION' in attrs:
                                pos_acc_idx = attrs['POSITION']
                                acc = accessors[pos_acc_idx]
                                if 'min' in acc and 'max' in acc:
                                    for i in range(3):
                                        min_bound[i] = min(min_bound[i], acc['min'][i])
                                        max_bound[i] = max(max_bound[i], acc['max'][i])
                                        
                    print(f"Global Model Bounds:")
                    print(f"  Min: {min_bound}")
                    print(f"  Max: {max_bound}")
                    print(f"  Size: {[max_bound[i] - min_bound[i] for i in range(3)]}")
                    return
                else:
                    f.seek(chunk_length, 1)
            except Exception as e:
                break

if __name__ == "__main__":
    parse_glb('static/media/retro_computer.glb')
