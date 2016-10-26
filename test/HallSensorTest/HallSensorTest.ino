
//sets ground pin to LOW and input pin to HIGH
void setup()
{
 Serial.begin(9600);
}

int getIndexOfMinimumValue(int* array, int size){
 int minIndex = 0;
 int min = array[minIndex];
 for (int i=1; i<size; i++){
   if (array[i]<min){
     min = array[i];
     minIndex = i;
   }
 }
 return minIndex;
}


bool isIncreasing;
int lastLowestIndex;
unsigned long lastTimeMeasured;

void loop()
{
  unsigned long now = millis();

  int values[8];
  values[0] = analogRead(0);
  values[1] = analogRead(1);
  values[2] = analogRead(2);
  values[3] = analogRead(3);
  values[4] = analogRead(4);
  values[5] = analogRead(5);
  values[6] = analogRead(6);
  values[7] = analogRead(7);

  int minIndex = getIndexOfMinimumValue(values, 8);
  if (values[minIndex] < 300 && minIndex != lastLowestIndex) {
   lastLowestIndex = minIndex; 
   lastTimeMeasured = now;
  }
  if (now - lastTimeMeasured > 300) {
   Serial.print("Found slot: ");
   Serial.println(lastLowestIndex);
  }
 
 delay(100);
}
