import struct
import json

def read_dbf(dbf_path):
    with open(dbf_path, 'rb') as f:
        header = f.read(32)
        num_records, header_len, record_len = struct.unpack('<IHH', header[4:12])
        fields = []
        while True:
            field_data = f.read(32)
            if not field_data or field_data[0] == 0x0D:
                break
            name = field_data[:11].replace(b'\x00', b'').decode('ascii').strip()
            typ = chr(field_data[11])
            length = field_data[16]
            fields.append((name, typ, length))
        
        f.seek(header_len)
        records = []
        for _ in range(num_records):
            rec_bytes = f.read(record_len)
            if not rec_bytes or rec_bytes[0] == 0x2A:
                continue
            offset = 1
            rec = {}
            for name, typ, length in fields:
                val = rec_bytes[offset:offset+length].decode('utf-8', errors='ignore').strip()
                rec[name] = val
                offset += length
            records.append(rec)
    return records

def read_shp(shp_path):
    shapes = []
    with open(shp_path, 'rb') as f:
        f.seek(100)
        while True:
            rec_hdr = f.read(8)
            if len(rec_hdr) < 8:
                break
            rec_num, content_len = struct.unpack('>II', rec_hdr)
            content_bytes = f.read(content_len * 2)
            if len(content_bytes) < content_len * 2:
                break
            shape_type = struct.unpack('<I', content_bytes[:4])[0]
            if shape_type == 5: # Polygon
                box = struct.unpack('<4d', content_bytes[4:36])
                num_parts, num_points = struct.unpack('<II', content_bytes[36:44])
                parts = struct.unpack(f'<{num_parts}I', content_bytes[44:44 + 4 * num_parts])
                pts_bytes = content_bytes[44 + 4 * num_parts : 44 + 4 * num_parts + 16 * num_points]
                pts = struct.unpack(f'<{num_points * 2}d', pts_bytes)
                points = [(pts[i*2], pts[i*2 + 1]) for i in range(num_points)]
                
                # Split by parts
                polygon_parts = []
                for p_idx in range(num_parts):
                    start = parts[p_idx]
                    end = parts[p_idx + 1] if p_idx + 1 < num_parts else num_points
                    polygon_parts.append(points[start:end])
                shapes.append({'box': box, 'parts': polygon_parts})
            else:
                shapes.append(None)
    return shapes

if __name__ == '__main__':
    records = read_dbf('scripts/gis/S05_AC.dbf')
    shapes = read_shp('scripts/gis/S05_AC.shp')
    print(f'Total DBF records: {len(records)}, Total SHP shapes: {len(shapes)}')
    for idx, r in enumerate(records):
        name = r.get('AC_NAME', '')
        no = r.get('NO', '')
        print(f'{idx}: NO={no} NAME={name}')
