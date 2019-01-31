package models;

public class Result {
    public Climbing seqClimbing, parClimbing;

    public Result(){
        this.seqClimbing = new Climbing();
        this.parClimbing = new Climbing();
    }

    @Override
    public String toString() {
        return "Sequential \n " + seqClimbing +
                " \n\n\n Parralel " + parClimbing + "\n";
    }
}
