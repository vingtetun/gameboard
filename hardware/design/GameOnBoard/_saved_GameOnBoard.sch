EESchema Schematic File Version 2
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L CONN_02X08 LEDDisplay
U 1 1 5849E72C
P 5000 1500
F 0 "LEDDisplay" H 5000 1950 50  0000 C CNN
F 1 "CONN_02X08" V 5000 1500 50  0000 C CNN
F 2 "" H 5000 300 50  0000 C CNN
F 3 "" H 5000 300 50  0000 C CNN
	1    5000 1500
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X10 P?
U 1 1 5849E8BA
P 3450 1600
F 0 "P?" H 3450 2150 50  0000 C CNN
F 1 "CONN_01X10" V 3550 1600 50  0000 C CNN
F 2 "" H 3450 1600 50  0000 C CNN
F 3 "" H 3450 1600 50  0000 C CNN
	1    3450 1600
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P?
U 1 1 5849E953
P 3450 2600
F 0 "P?" H 3450 3050 50  0000 C CNN
F 1 "CONN_01X08" V 3550 2600 50  0000 C CNN
F 2 "" H 3450 2600 50  0000 C CNN
F 3 "" H 3450 2600 50  0000 C CNN
	1    3450 2600
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P?
U 1 1 5849E9B2
P 1350 1650
F 0 "P?" H 1350 2100 50  0000 C CNN
F 1 "CONN_01X08" V 1450 1650 50  0000 C CNN
F 2 "" H 1350 1650 50  0000 C CNN
F 3 "" H 1350 1650 50  0000 C CNN
	1    1350 1650
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P?
U 1 1 5849E9F2
P 1350 2600
F 0 "P?" H 1350 3050 50  0000 C CNN
F 1 "CONN_01X08" V 1450 2600 50  0000 C CNN
F 2 "" H 1350 2600 50  0000 C CNN
F 3 "" H 1350 2600 50  0000 C CNN
	1    1350 2600
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P?
U 1 1 5849EA53
P 1350 3500
F 0 "P?" H 1350 3950 50  0000 C CNN
F 1 "CONN_01X08" V 1450 3500 50  0000 C CNN
F 2 "" H 1350 3500 50  0000 C CNN
F 3 "" H 1350 3500 50  0000 C CNN
	1    1350 3500
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P?
U 1 1 5849EAAE
P 3450 3500
F 0 "P?" H 3450 3950 50  0000 C CNN
F 1 "CONN_01X08" V 3550 3500 50  0000 C CNN
F 2 "" H 3450 3500 50  0000 C CNN
F 3 "" H 3450 3500 50  0000 C CNN
	1    3450 3500
	-1   0    0    1   
$EndComp
$Comp
L CONN_02X18 P?
U 1 1 5849EB1D
P 2350 4400
F 0 "P?" H 2350 5350 50  0000 C CNN
F 1 "CONN_02X18" V 2350 4400 50  0000 C CNN
F 2 "" H 2350 3350 50  0000 C CNN
F 3 "" H 2350 3350 50  0000 C CNN
	1    2350 4400
	0    1    1    0   
$EndComp
Text Notes 2000 2750 0    60   ~ 0
ArduinoMega
Entry Wire Line
	4400 1050 4500 1150
Entry Wire Line
	4400 1150 4500 1250
Entry Wire Line
	4400 1250 4500 1350
Entry Wire Line
	4400 1350 4500 1450
Entry Wire Line
	4400 1450 4500 1550
Entry Wire Line
	4400 1550 4500 1650
Entry Wire Line
	4400 1650 4500 1750
Entry Wire Line
	4400 1750 4500 1850
Text Label 4500 1150 0    60   ~ 0
G1
Text Label 4500 1250 0    60   ~ 0
GND
Text Label 4500 1350 0    60   ~ 0
G2
Text Label 4500 1450 0    60   ~ 0
GND
Text Label 4500 1550 0    60   ~ 0
B
Text Label 4500 1650 0    60   ~ 0
D
Text Label 4500 1750 0    60   ~ 0
LAT
Text Label 4500 1850 0    60   ~ 0
GND
Entry Wire Line
	5500 1150 5600 1250
Entry Wire Line
	5500 1250 5600 1350
Entry Wire Line
	5500 1350 5600 1450
Entry Wire Line
	5500 1450 5600 1550
Entry Wire Line
	5500 1550 5600 1650
Entry Wire Line
	5500 1650 5600 1750
Entry Wire Line
	5500 1750 5600 1850
Entry Wire Line
	5500 1850 5600 1950
Text Label 5250 1150 0    60   ~ 0
R1
Text Label 5250 1250 0    60   ~ 0
B1
Text Label 5250 1350 0    60   ~ 0
R2
Text Label 5250 1450 0    60   ~ 0
B2
Text Label 5250 1550 0    60   ~ 0
A
Text Label 5250 1650 0    60   ~ 0
C
Text Label 5250 1750 0    60   ~ 0
CLK
Text Label 5250 1850 0    60   ~ 0
OE
Text Label 3800 1950 0    60   ~ 0
OE
Wire Wire Line
	4750 1150 4500 1150
Wire Wire Line
	4750 1250 4500 1250
Wire Wire Line
	4750 1350 4500 1350
Wire Wire Line
	4750 1450 4500 1450
Wire Wire Line
	4500 1550 4750 1550
Wire Wire Line
	4500 1650 4750 1650
Wire Wire Line
	4750 1750 4500 1750
Wire Wire Line
	4500 1850 4750 1850
Wire Bus Line
	4400 1050 4400 1750
Wire Wire Line
	5250 1150 5500 1150
Wire Wire Line
	5250 1250 5500 1250
Wire Wire Line
	5250 1350 5500 1350
Wire Wire Line
	5250 1450 5500 1450
Wire Wire Line
	5250 1550 5500 1550
Wire Wire Line
	5250 1650 5500 1650
Wire Wire Line
	5250 1750 5500 1750
Wire Wire Line
	5250 1850 5500 1850
Wire Bus Line
	5600 1250 5600 1950
Wire Wire Line
	3650 1950 3800 1950
Wire Wire Line
	3650 2050 3800 2050
Text Label 3800 2050 0    60   ~ 0
CLK
Text Label 3000 4150 0    60   ~ 0
R1
Text Label 3000 4650 0    60   ~ 0
G1
Text Label 2900 4150 0    60   ~ 0
B1
$EndSCHEMATC
