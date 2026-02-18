"""
Geometry helpers for MULTIPOINT conversion
"""
import re


def points_to_multipoint_wkt(points: list) -> str:
    """Convertit une liste de (lon, lat) en WKT MULTIPOINT."""
    coords = ",".join(f"({lon} {lat})" for lon, lat in points)
    return f"MULTIPOINT({coords})"


def parse_multipoint(raw) -> list:
    """
    Convertit le résultat MySQL d'un MULTIPOINT (bytes WKB ou None)
    en liste de [lon, lat] lisible en JSON via ST_AsText.
    Cette fonction est utilisée après un SELECT ST_AsText(...).
    Format retourné par MySQL : 'MULTIPOINT((lon lat),(lon lat),...)'
    """
    if raw is None:
        return None
    # raw est une string du style "MULTIPOINT((2.29 48.85),(2.37 48.84))"
    matches = re.findall(r'\(([-\d.]+)\s+([-\d.]+)\)', raw)
    return [[float(lon), float(lat)] for lon, lat in matches]