package models;

import java.util.ArrayList;
import java.util.HashMap;

public class Climbing {
    public HashMap<Integer, Climber> climbers = new HashMap<>();
    public Float duration;
    public Status bestPoint;


    @Override
    public String toString() {
        return "Climbers : " + climbers.size()
                + "; Duration : " + duration
                + "; Best : " + bestPoint + "\n";
    }
}
