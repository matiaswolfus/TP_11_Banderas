# Prompts usados para los plus del TP 11

## Prompt 1 — Multijugador

```
Ahora quiero hacer el plus de multijugador. Antes de jugar, el usuario pone su nombre y elige el modo (banderas o capitales) en una pantalla de inicio (StartScreen). Agregá un botón para terminar la partida que guarde el mejor puntaje de cada jugador en localStorage y vuelva al inicio. Como en mobile no hay localStorage, usá expo-sqlite. Todo tiene que estar en el GameContext, nada por props.
```

## Prompt 2 — Ranking

```
Haceme el componente Leaderboard que muestre el top 10 de jugadores ordenado por puntaje, y que aparezca en la pantalla de inicio.
```

## Prompt 3 — Pistas

```
Ahora las pistas: un botón que revele una letra al azar del nombre del país y reste 2 segundos del timer. Mostrá el nombre con guiones en las letras que faltan.
```

## Prompt 4 — Modo capitales

```
Por último, el modo capitales. Traé las capitales de https://countriesnow.space/api/v0.1/countries/capital y uní los datos con los países. Cuando aparece la bandera, mostrá 3 opciones de capital. Si acierta, suma 10 más los segundos que quedan; si falla, resta 1. Cada 5 segundos se tacha una opción incorrecta.
```
