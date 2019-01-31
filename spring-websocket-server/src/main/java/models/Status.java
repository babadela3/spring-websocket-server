package models;

public class Status {
    public Float score;
    public Float x;
    public Float y;

    public Status(Float score, Float x, Float y){
        this.score = score;
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return ""
                + score
                + " at "
                + "(" + x + ", " + y + ")";
    }
}
